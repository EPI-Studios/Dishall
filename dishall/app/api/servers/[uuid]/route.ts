import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { inviteLinkSchema } from "@/lib/validation";

const serverDataValidation = z.object({
  name: z.string().optional(),
  description: z.string().min(50, "La description doit au moins faire 50 caractères.").optional(),
  link: inviteLinkSchema.optional(),
  category: z.string().min(2, "La catégorie doit au moins comporter deux caractères").optional(),
  country: z.string().optional()
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const token = request.cookies.get("token")?.value;
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Internal server error
  }

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  let discordId: string;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload.sub) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
    discordId = payload.sub;
  } catch {
    return NextResponse.json(
      { error: "Token invalide ou expiré" },
      { status: 401 },
    );
  }

  const { uuid } = await params;

  try {
    await prisma.server.delete({
      where: { uuid, user: { discord_id: discordId } },
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
};


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> },
) {
  const token = request.cookies.get("token")?.value;
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Internal server error
  }

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  let discordId: string;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!payload.sub) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }
    discordId = payload.sub;
  } catch {
    return NextResponse.json(
      { error: "Token invalide ou expiré" },
      { status: 401 },
    );
  }

  const { uuid } = await params;

  const serverToFind = await prisma.server.findUnique({
    where: { uuid }
  });

  if (!serverToFind) {
    return NextResponse.json({ error: "Server introuvable" }, { status: 404 }); // Not found
  }

  const userToFind = await prisma.user.findUnique({
    where: { discord_id: discordId }
  })

   if (!userToFind) {
    return NextResponse.json({ error: "User introuvable" }, { status: 404 }); // Not found
  }

  if (serverToFind.user_id !== userToFind.id) {
    return NextResponse.json(
      { error: "Interdit" },
      { status: 403 }, // Forbidden
    );
  }

  const body = await request.json();
  const { data, error } = await serverDataValidation.safeParseAsync(body);

  if (error) {
    return NextResponse.json(
      { error: "Données invalides", details: error.issues },
      { status: 400 },
    );
  }

  try {
    const updatedServer = await prisma.server.update({
      where: { uuid },
      data,
    });

    return Response.json(updatedServer, { status: 200 }); // No content
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server Error
  }
}
