import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["member", "moderator"]),
});

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
    }

    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server error
  }
};


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }>},
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

  const { discord_id }= await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); // Bad Request
  }

  const parsed = roleSchema.safeParse(body);  
  if (!parsed.success) {
    return NextResponse.json({ error: "Rôle invalide" }, { status: 400 }); // Bad Request
  }

  const target = await prisma.user.findUnique({
    where: { discord_id },
    select: { role: true },
  });

  if (!target) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 }); // Not Found
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { error: "Impossible de modifier le rôle d'un administrateur" },
      { status: 403 }, // Forbidden
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { discord_id },
      data: { role: parsed.data.role },
      select: { discord_id: true, pseudo: true, role: true}
    });
    return NextResponse.json(updatedUser)
  } catch  {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
