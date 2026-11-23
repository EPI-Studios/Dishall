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

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Unauthorized
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 }); // Bad Request
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bad request", details: parsed.error.issues },
      { status: 400 }, // Bad Request
    );
  }

  const { serverUuid, rate, comment } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Unauthorized
  }

  const server = await prisma.server.findUnique({
    where: { uuid: serverUuid },
    select: { id: true, user_id: true, status: true },
  });

  // Si un serveur est pending ou rejected
  if (!server || server.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 }); // Not Found
  }

  // Règle métier : on ne note pas son propre serveur
  if (server.user_id === user.id) {
    return NextResponse.json(
      { error: "Forbidden" },
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
        user: { connect: { id: user.id } },
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
        { error: "Conflict" },
        { status: 409 }, // Conflict
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Server error
  }
}
