import jwt, { JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { clearStateCookie, isValidState } from "@/lib/auth/oauth";

const discordTokenSchema = z.object({
  access_token: z.string(),
});

const discordMeSchema = z.object({
  id: z.string(),
});

const discordGuildSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  banner: z.string().nullable(),
  owner: z.boolean(),
  approximate_member_count: z.number().optional(),
});

// Réponse d'erreur qui supprime aussi le state : il est à usage unique
function fail(error: string, status: number) {
  const response = NextResponse.json({ error }, { status });
  clearStateCookie(response, "guild");
  return response;
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  // Code absent (autorisation refusée sur Discord) ou state invalide (protection CSRF)
  if (!code || !isValidState(request, "guild")) {
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    clearStateCookie(response, "guild");
    return response;
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
    return fail("Internal server error", 500); // Internal server error
  }

  // On récupère l'utilisateur connecté grâce à son cookie de session
  const sessionToken = request.cookies.get("token")?.value;

  if (!sessionToken) {
    return fail("Unauthorized", 401); // Unauthorized
  }

  let discordId: string;

  try {
    const payload = jwt.verify(sessionToken, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as JwtPayload;

    if (!payload.sub) throw new Error("sub manquant");
    discordId = payload.sub;
  } catch {
    return fail("Unauthorized", 401); // Unauthorized
  }

  // On envoie le code pour recevoir un access token
  let accessToken: string;

  try {
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", // Données de formulaire : paires clé=valeur
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
      return fail("Bad request", 400); // Bad Request
    }

    const tokenData = discordTokenSchema.safeParse(await tokenResponse.json());
    if (!tokenData.success) {
      return fail("Bad gateway", 502); // Bad Gateway
    }

    accessToken = tokenData.data.access_token;
  } catch {
    return fail("Bad gateway", 502); // Bad Gateway
  }

  // Profil (pour vérifier l'identité) et serveurs de l'utilisateur, en parallèle
  let me: z.infer<typeof discordMeSchema>;
  let guilds: z.infer<typeof discordGuildSchema>[];

  try {
    const headers = { Authorization: `Bearer ${accessToken}` };

    const [meResponse, guildsResponse] = await Promise.all([
      fetch("https://discord.com/api/users/@me", { headers }),
      fetch("https://discord.com/api/users/@me/guilds?with_counts=true", { headers }),
    ]);

    if (!meResponse.ok || !guildsResponse.ok) {
      return fail("Bad gateway", 502); // Bad Gateway
    }

    const parsedMe = discordMeSchema.safeParse(await meResponse.json());
    const parsedGuilds = z
      .array(discordGuildSchema)
      .safeParse(await guildsResponse.json());

    if (!parsedMe.success || !parsedGuilds.success) {
      return fail("Bad gateway", 502); // Bad Gateway
    }

    me = parsedMe.data;
    guilds = parsedGuilds.data;
  } catch {
    return fail("Bad gateway", 502); // Bad Gateway
  }

  // Discord permet de changer de compte sur l'écran d'autorisation :
  // on refuse si ce n'est pas le compte connecté à Dishall.
  if (me.id !== discordId) {
    return fail(
      "Forbidden",
      403, // Forbidden
    );
  }

  const ownerGuilds = guilds.filter((guild) => guild.owner === true);

  // On crée le ou les serveurs s'ils ne sont pas dans la base de données.
  // $transaction regroupe les upserts : soit tout est créé, soit rien.
  try {
    await prisma.$transaction(
      ownerGuilds.map((guild) =>
        prisma.server.upsert({
          where: { guild_id: guild.id },
          create: {
            guild_id: guild.id,
            name: guild.name,
            description: "",
            link: "",
            status: "pending",
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
            // upsert (et non update) : la ligne de stats peut ne pas exister encore
            serverStats: {
              upsert: {
                create: { users_nb: guild.approximate_member_count ?? 0 },
                update: { users_nb: guild.approximate_member_count ?? 0 },
              },
            },
          },
        }),
      ),
    );
  } catch (error) {
    console.error(error);
    return fail("Internal server error", 500); // Internal server error
  }

  const response = NextResponse.redirect(new URL("/dashboard", CLIENT_REDIRECT_URL));
  clearStateCookie(response, "guild");

  return response;
}