import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { Prisma } from "@/generated/prisma/client";

const reviewSchema = z.object({
  serverUuid: z.uuid(),
  rate: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(1000),
});

export async function GET(request: Request) {
  const serverUuid = new URL(request.url).searchParams.get("serverUuid");

  if (!serverUuid) {
    return NextResponse.json({ error: "serverUuid invalide" }, { status: 400 });
  }

  const reviews = await prisma.critic.findMany({
    where: { status: "approved", server: { uuid: serverUuid } },
    orderBy: { created_at: "desc" },
    select: {
      uuid: true,
      created_at: true,
      rate: true,
      comment: true,
      user: {
        select: {
          pseudo: true,
          avatar: true,
        },
      },
    },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); // Bad Request
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.issues },
      { status: 400 }, // Bad Request
    );
  }

  const { serverUuid, rate, comment } = parsed.data;

  const me = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { id: true },
  });

  if (!me) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const server = await prisma.server.findUnique({
    where: { uuid: serverUuid },
    select: { id: true, user_id: true, status: true },
  });

  // Si un serveur est pending ou rejected
  if (!server || server.status !== "approved") {
    return NextResponse.json({ error: "Serveur introuvable" }, { status: 404 }); // Not Found
  }

  // Règle métier : on ne note pas son propre serveur
  if (server.user_id === me.id) {
    return NextResponse.json(
      { error: "Tu ne peux pas donner d'avis sur ton propre serveur" },
      { status: 403 }, // Forbidden
    );
  }

  try {
    const review = await prisma.critic.create({
      data: {
        comment,
        rate,
        status: "approved",
        server: { connect: { id: server.id } },
        user: { connect: { id: me.id } },
      },
      select: {
        uuid: true,
        comment: true,
        rate: true,
        status: true,
        created_at: true,
        user: { select: { pseudo: true, avatar: true } },
      },
    });

    return NextResponse.json(review, { status: 201 }); // Created
  } catch (error) {
    // Contrainte unique (server_id, user_id) : un seul avis par utilisateur et par serveur.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Tu as déjà donné ton avis sur ce serveur" },
        { status: 409 }, // Conflict
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server error
  }
}
