import { connection, NextResponse } from "next/server";
import { buildDiscordAuthorizeRedirect } from "@/lib/auth/oauth";

export async function GET() {
  // Force l'exécution à chaque requête : sans ça, le state aléatoire pourrait être figé au build
  await connection();

  const { DISCORD_GUILD_REDIRECT_URI } = process.env;

  // "identify" sert à vérifier au retour que le compte Discord qui autorise est bien celui connecté.
  // "guilds.join" est retiré : rien ne l'utilise (moindre privilège).
  const response = DISCORD_GUILD_REDIRECT_URI
    ? buildDiscordAuthorizeRedirect("guild", {
        redirectUri: DISCORD_GUILD_REDIRECT_URI,
        scope: "identify guilds",
      })
    : null;

  if (!response) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Internal server error
  }

  return response;
}