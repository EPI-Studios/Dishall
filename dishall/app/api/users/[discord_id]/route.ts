import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { Prisma } from "@/generated/prisma/client";

const userDataValidation = z.object({
  pseudo: z.string().trim().min(2).max(50).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const { discord_id } = await params;

  if (currentUser.sub !== discord_id) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 }); // Forbidden
  }

  const body = await request.json();
  const { data, error } = await userDataValidation.safeParseAsync(body);

  if (error) {
    return NextResponse.json(
      { error: "Données invalides", details: error.issues },
      { status: 400 },
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { discord_id },
      data,
      select: { discord_id: true, pseudo: true, avatar: true },
    });

    return Response.json(updatedUser, { status: 200 }); // OK
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server Error
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const admin = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { role: true },
  });
  if (admin?.role !== "admin") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 }); // Forbidden
  }

  const { discord_id } = await params;

  if (discord_id === currentUser.sub) {
    return NextResponse.json(
      { error: "Tu ne peux pas supprimer ton propre compte" },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { discord_id },
    select: { role: true },
  });

  if (!target) {
    return NextResponse.json(
      { error: "Utilisateur introuvable" },
      { status: 404 },
    ); // Not Found
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { error: "Impossible de supprimer un administrateur" },
      { status: 403 }, // Forbidden
    );
  }

  try {
    await prisma.user.delete({ where: { discord_id } });
    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Utilisateur introuvable" },
          { status: 404 },
        );
      }
      if (error.code === "P2003") {
        // Contrainte de clé étrangère : l'user a encore des serveurs, critiques...
        return NextResponse.json(
          { error: "Cet utilisateur a des données liées" },
          { status: 409 },
        );
      }
    }

    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server error
  }
}
