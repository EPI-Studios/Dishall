import { prisma } from "@/lib/prisma";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const userDataValidation = z.object({
  pseudo: z.string().optional()
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
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

  const { discord_id } = await params;

  const user = await prisma.user.findUnique({
    where: { discord_id },
  });

  if (!user) {
    return NextResponse.json({ error: "User introuvable" }, { status: 404 }); // Not found
  }

  if (user.discord_id !== discordId) {
    return NextResponse.json(
      { error: "Interdit" },
      { status: 403 }, // Forbidden
    );
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
    });

    return Response.json(updatedUser, { status: 200 }); // No content
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server Error
  }
}
