import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { JWT_SECRET } = process.env;

  if (!JWT_SECRET) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Internal server error
  }

  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    if (!payload.sub) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 }); // Unauthorized
    }

    const user = await prisma.user.findUnique({
      where: { discord_id: payload.sub },
      select: { discord_id: true, pseudo: true, avatar: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 401 }); // Unauthorized
    }

    return NextResponse.json(user);
  } catch {
    // token expiré ou falsifé
    return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 401 });
  }
}