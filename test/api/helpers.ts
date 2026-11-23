// À placer dans : test/api/helpers.ts
import { execFileSync } from "node:child_process";
import jwt from "jsonwebtoken";

export const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3100";

// Comptes du seed (prisma/seed.ts). Le rôle réel est celui de la base : celui du jeton n'est qu'une déclaration.
export const USERS = {
  admin: { discordId: "1474360956502016057", role: "admin" }, // user 1
  moderator: { discordId: "810000000000000002", role: "moderator" }, // user 2 (LunaMod), propriétaire des serveurs 1 et 2
  member: { discordId: "810000000000000004", role: "member" }, // user 4 (NoctisBeats), propriétaire du serveur 4
} as const;

export type UserKey = keyof typeof USERS;

// Mêmes identifiants que le seed : uuid("b2", 4) -> b2000000-0000-4000-8000-000000000004
const uuid = (prefix: string, n: number) =>
  `${prefix}000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export const S = (n: number) => uuid("b2", n); // serveur
export const C = (n: number) => uuid("d4", n); // avis

// Sécurité : le seed fait un TRUNCATE. On refuse de tourner si la base n'est pas une base de test.
export function assertTestDatabase() {
  const url = process.env.DATABASE_URL ?? "";

  if (!/_test(\?|$)/.test(url)) {
    throw new Error(
      "DATABASE_URL ne pointe pas vers une base se terminant par _test : tests annulés pour protéger tes données.",
    );
  }
}

// Remet la base de test dans l'état du seed (à appeler dans before() de chaque fichier)
export function resetDb() {
  assertTestDatabase();

  execFileSync(
    process.execPath,
    [
      "./node_modules/prisma/build/index.js",
      "db",
      "seed",
      "--config",
      "prisma7.config.ts",
    ],
    { stdio: "pipe" },
  );
}

export function tokenFor(
  discordId: string,
  role: string,
  options: { secret?: string; expiresIn?: jwt.SignOptions["expiresIn"] } = {},
) {
  return jwt.sign({ sub: discordId, role }, options.secret ?? process.env.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: options.expiresIn ?? "1h",
  });
}

type ApiOptions = {
  method?: string;
  as?: UserKey; // se connecter avec le jeton de ce compte
  token?: string; // ou fournir directement un jeton (forgé, expiré...)
  body?: unknown;
};

export async function api(path: string, { method = "GET", as, token, body }: ApiOptions = {}) {
  const sessionToken = token ?? (as ? tokenFor(USERS[as].discordId, USERS[as].role) : undefined);

  return fetch(`${BASE_URL}${path}`, {
    method,
    redirect: "manual",
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(sessionToken ? { Cookie: `token=${sessionToken}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}