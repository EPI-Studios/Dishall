"use client";

import { UserType } from "@/@types/type";
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

  return { user, loading, logout };
}

export async function handleUpdateUser(discord_id: string, pseudo: string, avatar: string) {
  const updatedUser = {
    pseudo,
    avatar
  };

  try {
    const response = await fetch(`/api/users/${discord_id}`, 
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedUser),
      }, 
    );
    
    if (!response.ok) {
      console.error("Echec de la modification");
    }
  } catch (error) {
    console.error(error);
  }
}

