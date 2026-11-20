// À placer dans : lib/auth/oauth.ts (nouveau fichier)
import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

// Un cookie par flux, pour éviter les collisions si deux connexions sont ouvertes
const STATE_COOKIES = {
  login: "oauth_state_login",
  guild: "oauth_state_guild",
} as const;

export type OAuthFlow = keyof typeof STATE_COOKIES;

const STATE_MAX_AGE = 60 * 10; // 10 minutes pour finir l'autorisation sur Discord

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // "lax" est indispensable : le retour depuis discord.com est une navigation cross-site
  sameSite: "lax" as const,
  path: "/api/auth/discord", // couvre /callback et /guild/callback
};

/**
 * Construit la redirection vers Discord avec un `state` aléatoire,
 * et dépose ce même `state` dans un cookie httpOnly pour le comparer au retour.
 * Renvoie null si la configuration est incomplète.
 */
export function buildDiscordAuthorizeRedirect(
  flow: OAuthFlow,
  { redirectUri, scope }: { redirectUri: string; scope: string },
): NextResponse | null {
  const { DISCORD_CLIENT_ID } = process.env;
  if (!DISCORD_CLIENT_ID) return null;

  const state = randomBytes(32).toString("hex");

  const url = new URL("https://discord.com/oauth2/authorize");
  url.search = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: redirectUri,
    scope,
    state,
  }).toString();

  const response = NextResponse.redirect(url);
  response.cookies.set(STATE_COOKIES[flow], state, {
    ...cookieOptions,
    maxAge: STATE_MAX_AGE,
  });
  return response;
}

/** Compare le `state` de l'URL de retour avec celui du cookie (comparaison à temps constant). */
export function isValidState(request: NextRequest, flow: OAuthFlow): boolean {
  const fromUrl = request.nextUrl.searchParams.get("state");
  const fromCookie = request.cookies.get(STATE_COOKIES[flow])?.value;
  if (!fromUrl || !fromCookie) return false;

  const a = Buffer.from(fromUrl);
  const b = Buffer.from(fromCookie);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Le state est à usage unique : on le supprime une fois le flux terminé. */
export function clearStateCookie(response: NextResponse, flow: OAuthFlow) {
  response.cookies.set(STATE_COOKIES[flow], "", { ...cookieOptions, maxAge: 0 });
}