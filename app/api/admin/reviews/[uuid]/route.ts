import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import {
  logModAction,
  reasonSchema,
} from "@/lib/mod_actions/mod_action.server";

const statusSchema = z.object({
  status: z.enum(["approved", "pending", "hidden"]),
  reason: reasonSchema,
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const user = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { uuid: true, role: true },
  });

  if (user?.role !== "admin" && user?.role !== "moderator") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 }); // Forbidden
  }

  const { uuid } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); // Bad Request
  }

  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 }); // Bad Request
  }

  const { status, reason } = parsed.data;

  const review = await prisma.critic.findUnique({
    where: { uuid },
    select: { status: true },
  });

  if (!review) {
    return NextResponse.json(
      { error: "Commentaire introuvable" },
      { status: 404 },
    );
  }

  try {
    const [updatedReview] = await prisma.$transaction([
      prisma.critic.update({ where: { uuid }, data: { status } }),
      logModAction({
        moderatorUuid: user.uuid,
        action: "status_change",
        type: "review",
        target: uuid,
        reason: `${review.status} → ${status} : ${reason}`,
      }),
    ]);

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const user = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { role: true },
  });

  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 }); // Forbidden
  }

  const { uuid } = await params;

  try {
    await prisma.critic.delete({ where: { uuid } });
    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Commentaire introuvable" },
          { status: 404 },
        );
      }
    }

    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server error
  }
}
