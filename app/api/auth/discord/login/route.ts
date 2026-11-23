import { connection, NextResponse } from "next/server";
import { buildDiscordAuthorizeRedirect } from "@/lib/auth/oauth";
 
export async function GET() {
  // Avec cacheComponents, une route qui ne lit pas la requête peut être pré-rendue au build :
  // le state aléatoire serait alors figé et identique pour tout le monde.
  // connection() force l'exécution à chaque requête.
  await connection();
 
  const { DISCORD_REDIRECT_URI } = process.env;
 
  const response = DISCORD_REDIRECT_URI
    ? buildDiscordAuthorizeRedirect("login", {
        redirectUri: DISCORD_REDIRECT_URI,
        scope: "identify",
      })
    : null;
 
  if (!response) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Internal server error
  }
 
  return response;
}
 