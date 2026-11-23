import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { NextRequest, NextResponse } from "next/server";
import { inviteLinkSchema } from "@/util/validation";

const serverDataValidation = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit faire au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères")
    .optional(),
  description: z
    .string()
    .trim()
    .min(50, "La description doit au moins faire 50 caractères.")
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),
  link: inviteLinkSchema.optional(),
  category: z
    .string()
    .trim()
    .min(2, "La catégorie doit au moins comporter deux caractères")
    .max(20, "La catégorie ne peut pas dépasser 20 caractères")
    .optional(),
  country: z
    .string()
    .trim()
    .length(2, "Le pays doit être un code à 2 lettres (ex : FR)")
    .toUpperCase()
    .optional(),
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const { uuid } = await params;

  try {
    // Le filtre sur le propriétaire est dans le where : on ne peut supprimer que son propre serveur
    await prisma.server.delete({
      where: { uuid, user: { discord_id: currentUser.sub } },
    });

    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Serveur introuvable" },
        { status: 404 }, // Not found
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server error
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const { uuid } = await params;

  // Une seule requête : le serveur et le discord_id de son propriétaire
  const serverToFind = await prisma.server.findUnique({
    where: { uuid },
    select: { user: { select: { discord_id: true } } },
  });

  if (!serverToFind) {
    return NextResponse.json({ error: "Serveur introuvable" }, { status: 404 }); // Not found
  }

  if (serverToFind.user.discord_id !== currentUser.sub) {
    return NextResponse.json(
      { error: "Interdit" },
      { status: 403 }, // Forbidden
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); // Bad Request
  }

  const { data, error } = await serverDataValidation.safeParseAsync(body);

  if (error) {
    return NextResponse.json(
      { error: "Données invalides", details: error.issues },
      { status: 400 },
    );
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Aucune donnée à modifier" },
      { status: 400 },
    );
  }

  try {
    const updatedServer = await prisma.server.update({
      where: { uuid },
      data,
    });

    return Response.json(updatedServer, { status: 200 }); // OK
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server Error
  }
}
