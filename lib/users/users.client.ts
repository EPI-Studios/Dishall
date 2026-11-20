"use client";

import { RoleType, UserType } from "@/@types/type";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useUser() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return { user, setUser, loading, logout };
}

export async function handleUpdateUser(discord_id: string, pseudo: string) {

   let response: Response;

  try {
    response = await fetch(`/api/users/${discord_id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pseudo }),
    });
  } catch {
    throw new Error("Impossible de contacter le serveur");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "La modification a échoué");
  }

  return response.json(); 
};

export async function handleDeleteUser(discord_id: string) {
  let response: Response;

  try {
    response = await fetch(`/api/admin/users/${discord_id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch {
    // fetch lui-même a échoué (réseau coupé, serveur injoignable)
    throw new Error("Impossible de contacter le serveur");
  }

  if (!response.ok) {
    // Une erreur a un body { error }, le 204 de succès n'en a pas
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "La suppression a échoué");
  }
};

export async function handleUpdateUserRole(discord_id: string, role: RoleType) {
  let response: Response;

  try {
    response = await fetch(`/api/admin/users/${discord_id}/`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  } catch {
    throw new Error("Impossible de contacter le serveur");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "La modification a échoué");
  }
}

