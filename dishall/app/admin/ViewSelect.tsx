"use client";

import { useRouter } from "next/navigation";

export default function ViewSelect({ current }: { current: "servers" | "users" }) {
  const router = useRouter();

  return (
    <select
      value={current}
      onChange={(e) => router.push(`/admin?view=${e.target.value}`)}
      className="mb-4 rounded-lg border-2 border-pink bg-dark px-4 py-2"
      aria-label="Afficher"
    >
      <option value="servers">Serveurs</option>
      <option value="users">Utilisateurs</option>
    </select>
  );
}