import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const discordGuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  banner: z.string().nullable(),
  owner: z.boolean(),
  approximate_member_count: z.number().optional(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    console.error("code non trouvé")
    return NextResponse.redirect(new URL("/", request.url))
  }

  const {
    DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET,
    DISCORD_GUILD_REDIRECT_URI,
    JWT_SECRET,
    CLIENT_REDIRECT_URL,
  } = process.env;

  // On vérifie que les variables d'environnement sont bien là
  if (
    !DISCORD_CLIENT_ID ||
    !DISCORD_CLIENT_SECRET ||
    !DISCORD_GUILD_REDIRECT_URI ||
    !JWT_SECRET ||
    !CLIENT_REDIRECT_URL
  ) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }, // Internal server error
    );
  }

  // on récupère le user avec son cookie
  const sessionToken = request.cookies.get("token")?.value;
    
  if (!sessionToken) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const payload = jwt.verify(sessionToken, JWT_SECRET) as JwtPayload;

  const discordId = payload.sub;
 
  if (!discordId) {
    return NextResponse.redirect(("/"));
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
      redirect_uri: DISCORD_GUILD_REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json(
      { error: "Erreur" },
      { status: 400 }, // Bad Request
    );
  }

  const { access_token } = await tokenResponse.json();

  // Récupération des guilds de l'user
  const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds?with_counts=true", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!guildsResponse.ok) {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du token" },
      { status: 500 }, // Internal server error
    );
  }

  const parsed = z.array(discordGuildSchema).safeParse(await guildsResponse.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Réponse Discord inattendue" }, { status: 502 }); // Bad Gateway
  };

  const guilds = parsed.data;

  const ownerGuilds = guilds.filter((guild) => guild.owner === true);

  // On crée le ou les serveurs si il n'est pas dans la base de donnée
  // transaction permet de regrouper plusieurs serveurs pour les ajouter, soit tout est crée ou rien n'est crée
  await prisma.$transaction(
    ownerGuilds.map((guild) => 
      prisma.server.upsert({
        where: { guild_id: guild.id },
        create: {
          guild_id: guild.id,
          name: guild.name,
          description: "",
          link: "",
          status: "approved",
          banner: "",
          category: "",
          country: "FR", // valeur par défaut
          user: { connect: { discord_id: discordId } },
          icon: guild.icon ?? "https://cdn.discordapp.com/embed/avatars/0.png",
          serverStats: {
            create: { users_nb: guild.approximate_member_count ?? 0 },
          },
        },
        update: {
          name: guild.name,
          icon: guild.icon ?? "",

          serverStats: {
            update: {
              users_nb: guild.approximate_member_count ?? 0
            }
            
          }
        },
      })
  ));

  const redirectUrl = new URL("/dashboard", CLIENT_REDIRECT_URL);

  return NextResponse.redirect(redirectUrl);
}

