import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { redirect } from "next/navigation";

const discordGuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  owner: z.boolean(),
  approximate_member_count: z.number().optional(),
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
      { error: "Configuration serveur invalide" },
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
  const userResponse = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!userResponse.ok) {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du token" },
      { status: 500 }, // Internal server error
    );
  }

  console.log(userResponse);
  return userResponse.json();
}