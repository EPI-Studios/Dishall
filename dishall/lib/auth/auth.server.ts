import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connection } from "next/server";

type TokenPayload = { sub: string; role: string };

export async function getCurrentUser(): Promise<TokenPayload | null> {
  await connection();  // permet d'indiquer que le rendu doit attendre une requête utilisateur entrante avant de continuer.

  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch {
    return null; // token invalide ou expiré
  }
}
