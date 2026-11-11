import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

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
}