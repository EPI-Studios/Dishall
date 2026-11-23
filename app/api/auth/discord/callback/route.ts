// À placer dans : app/api/auth/discord/callback/route.ts (renomme le fichier en route.ts)
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { clearStateCookie, isValidState } from "@/lib/auth/oauth";
import { randomInt } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { isReservedPseudo } from "@/util/pseudo";

const discordTokenSchema = z.object({
  access_token: z.string(),
});

const discordUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().nullable(),
  global_name: z.string().nullable(), // null si l'utilisateur n'a pas de nom d'affichage
});

// Réponse d'erreur qui supprime aussi le state : il est à usage unique
function fail(error: string, status: number) {
  const response = NextResponse.json({ error }, { status });
  clearStateCookie(response, "login");
  return response;
}

async function findOrCreateUser(discordId: string, pseudoBase: string, avatar: string) {
  const existing = await prisma.user.findUnique({ where: { discord_id: discordId } });
  if (existing) {
    return prisma.user.update({ where: { discord_id: discordId }, data: { avatar } });
  }

  const base = pseudoBase.trim().slice(0, 45); // colonne VarChar(50) : on garde de la place pour le suffixe

  for (let attempt = 0; attempt < 5; attempt++) {
    // 1er essai : pseudo Discord tel quel (sauf s'il est réservé), puis suffixe aléatoire
    const pseudo =
      attempt === 0 && !isReservedPseudo(base) ? base : `${base}-${randomInt(1000, 10000)}`;

    try {
      return await prisma.user.create({ data: { discord_id: discordId, pseudo, avatar } });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
        throw error;
      }
      // Soit le pseudo est pris, soit deux connexions simultanées ont créé le compte : on regarde
      const created = await prisma.user.findUnique({ where: { discord_id: discordId } });
      if (created) return created;
    }
  }

  throw new Error("Error");
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  // Code absent (l'utilisateur a refusé l'autorisation sur Discord)
  // ou state invalide (protection contre le login CSRF) : retour à l'accueil
  if (!code || !isValidState(request, "login")) {
    const response = NextResponse.redirect(new URL("/", request.url));
    clearStateCookie(response, "login");
    return response;
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
    return fail("Internal server error", 500); // Internal server error
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
        redirect_uri: DISCORD_REDIRECT_URI,
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

  // Récupération du profil Discord
  let discordUser: z.infer<typeof discordUserSchema>;

  try {
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userResponse.ok) {
      return fail("Bad gateway", 502); // Bad Gateway
    }

    const parsed = discordUserSchema.safeParse(await userResponse.json());
    if (!parsed.success) {
      return fail("Bad gateway", 502); // Bad Gateway
    }

    discordUser = parsed.data;
  } catch {
    return fail("Bad gateway", 502); // Bad Gateway
  }

  const { id, username, global_name, avatar: discordAvatar } = discordUser;

  const avatar = discordAvatar
    ? `https://cdn.discordapp.com/avatars/${id}/${discordAvatar}.png`
    : "https://cdn.discordapp.com/embed/avatars/0.png"; // avatar par défaut

  // On crée l'utilisateur s'il n'est pas dans la base de données.
  // upsert sert à créer ou modifier si l'user existe déjà en base
  let user;

  try {
    user = await findOrCreateUser(id, global_name ?? username, avatar);
  } catch (error) {
    console.error(error);
    return fail("Internal server error", 500); // Internal server error
  }

  // Le rôle reste dans le token : proxy.ts s'en sert pour rediriger /admin et /moderation.
  // Les routes API, elles, relisent toujours le rôle en base.
  const token = jwt.sign({ sub: id, role: user.role }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "7d",
  });

  const response = NextResponse.redirect(new URL(CLIENT_REDIRECT_URL));

  response.cookies.set("token", token, {
    httpOnly: true, // Bloque l'accès au token via JS => limite l'impact d'une faille XSS
    secure: process.env.NODE_ENV === "production", // Force la transmission via HTTPS uniquement
    sameSite: "lax", // Le cookie n'est pas envoyé sur les requêtes POST venues d'un autre site
    maxAge: 60 * 60 * 24 * 7, // 604 800s = 7 jours
    path: "/", // le cookie est envoyé sur toutes les routes
  });

  clearStateCookie(response, "login");

  return response;
}