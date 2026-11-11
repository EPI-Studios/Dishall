import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

const discordUserSchema = z.object({
  id: z.string(),
  avatar: z.string().nullable(),
  global_name: z.string(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    console.error("code non trouvé")
    redirect("/")
  }

  const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_REDIRECT_URI,
    JWT_SECRET,
    CLIENT_REDIRECT_URL,
  } = process.env;

  // On vérifie que les variables d'environnement sont bien là
  if (
    !DISCORD_CLIENT_ID ||
    !DISCORD_CLIENT_SECRET ||
    !DISCORD_REDIRECT_URI ||
    !JWT_SECRET ||
    !CLIENT_REDIRECT_URL
  ) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }, // Internal server error
    );
  }

  // On envoie le code pour recevoir un access token
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Pour envoyer des données de formulaire sous forme de chaîne de caractères composée de paires clé-valeur
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json(
      { error: "Erreur" },
      { status: 400 }, // Bad Request
    );
  }

  const { access_token } = await tokenResponse.json();

  // Récupération du profil Discord
  const userResponse = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userResponse.ok) {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du token" },
      { status: 500 }, // Internal server error
    );
  }

  const parsed = discordUserSchema.safeParse(await userResponse.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Profil Discord invalide" },
      { status: 502 }, // Bad gateway
    );
  }

  const { id, global_name, avatar: discordAvatar } = parsed.data;

  const avatar = discordAvatar
  ? `https://cdn.discordapp.com/avatars/${id}/${discordAvatar}.png`
  : "https://cdn.discordapp.com/embed/avatars/0.png"; // avatar par défaut

  // On crée l'utilisateur si il n'est pas dans la base de donnée
  // upsert sert à créer ou modifier si l'user existe déjà en base
  await prisma.user.upsert({
    where: { discord_id: id },
    update: {
      pseudo: global_name,
      avatar: avatar,
    },
    create: {
      discord_id: id,
      pseudo: global_name,
      avatar: avatar,
    },
  });

  const token = jwt.sign({ sub: id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const response = NextResponse.redirect(new URL(CLIENT_REDIRECT_URL));

  response.cookies.set("token", token, {
    httpOnly: true, // Bloque l'accès au token via JS => protection XSS(cross-site scripting)
    secure: process.env.NODE_ENV === "production", // Force la transmission via HTTPS uniquement
    sameSite: "lax", // Contre l'usupation d'identité (Cross-Site Request Forgery)
    maxAge: 60 * 60 * 24 * 7, // 604 800s = 7 jours
    path: "/", // le cookie est envoyé sur toutes les routes
  });

  return response;
}
