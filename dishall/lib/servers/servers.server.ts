import "server-only";

import type { ServerType } from "../../@types/type";
import { getCurrentUser } from "../auth/auth.server";
import { prisma } from "../prisma";

export async function getServers(): Promise<ServerType[]> {
  
  const httpResponse = await fetch(`${process.env.API_URL}/servers`);
  
  if (!httpResponse.ok) {
    throw new Error("Impossible de charger les serveurs")
  }
  
  const servers = await httpResponse.json();

  return servers;
};

export async function getLatestServers(limit = 4) {
  const servers = await getServers();
  return servers 
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function getServerByUuid(uuid: string): Promise<ServerType | undefined> {
  const servers = await getServers()
  
  return servers.find((s: ServerType) => s.uuid === uuid);
};

const PAGE_SIZE = 10;

export async function getAllServersForAdmin(page = 1) {
  const current = await getCurrentUser();
  if (!current) return null;

  const user = await prisma.user.findUnique({
    where: { discord_id: current.sub },
    select: { role: true },
  });
  if (user?.role !== "admin") return null;

  const [servers, total] = await prisma.$transaction([
    prisma.server.findMany({
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        uuid: true,
        name: true,
        status: true,
        guild_id: true,
        icon: true,
        serverStats: { select: { users_nb: true, server_bump: true, last_bump_at: true } },
        score: true
      },
    }),
    prisma.server.count(),
  ]);

  return { servers, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}


