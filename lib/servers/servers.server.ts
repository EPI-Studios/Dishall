import "server-only";

import type { ServerType } from "../../@types/type";
import { getCurrentUser } from "../auth/auth.server";
import { prisma } from "../prisma";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

const publicServerSelect = {
  uuid: true,
  guild_id: true,
  name: true,
  description: true,
  link: true,
  category: true,
  country: true,
  icon: true,
  banner: true,
  created_at: true,
  tags: { select: { tag: { select: { name: true } } } },
  serverStats: { select: { users_nb: true, server_bump: true } },
  critics: { where: { status: "approved" }, select: { rate: true } },
} satisfies Prisma.ServerSelect;

type PublicServer = Prisma.ServerGetPayload<{ select: typeof publicServerSelect }>;

function toServerType(server: PublicServer): ServerType {
  const rates = server.critics.map((critic) => critic.rate);

  return {
    uuid: server.uuid,
    guild_id: server.guild_id,
    name: server.name,
    description: server.description ?? "",
    link: server.link ?? "",
    category: server.category ?? "",
    country: server.country ?? "",
    icon: server.icon ?? "",
    banner: server.banner ?? "",
    created_at: server.created_at,
    members: server.serverStats?.users_nb ?? 0,
    bumped: server.serverStats?.server_bump ?? false,
    tags: server.tags.map((serverTag) => serverTag.tag.name),
    rating: rates.length ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : 0,
    reviewCount: rates.length,
  };
}

export async function getServers(): Promise<ServerType[]> {
  
  const servers = await prisma.server.findMany({
    where: { status: "approved" },
    select: publicServerSelect,
  });

  return servers.map(toServerType);
};

export async function getLatestServers(limit = 4): Promise<ServerType[]> {
  // Tri et limite en base 
  const servers = await prisma.server.findMany({
    where: { status: "approved" },
    orderBy: { created_at: "desc" },
    take: limit,
    select: publicServerSelect,
  });

  return servers.map(toServerType);
}

export async function getServerByUuid(uuid: string): Promise<ServerType | undefined> {
  // La colonne est de type @db.Uuid : un identifiant mal formé ferait planter Prisma (500)
  if (!z.uuid().safeParse(uuid).success) return undefined;

  const server = await prisma.server.findFirst({
    where: { uuid, status: "approved" },
    select: publicServerSelect,
  });

  return server ? toServerType(server) : undefined;
}

const PAGE_SIZE = 10;

export async function getAllServersForAdmin(page = 1) {
  const current = await getCurrentUser();
  if (!current) return null;

  const user = await prisma.user.findUnique({
    where: { discord_id: current.sub },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "moderator") return null;

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
      },
    }),
    prisma.server.count(),
  ]);

  return { servers, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
};

export async function isServerOwner(serverUuid: string): Promise<boolean> {
  const current = await getCurrentUser();
  if (!current) return false;

  const count = await prisma.server.count({
    where: { uuid: serverUuid, user: { discord_id: current.sub } },
  });

  return count > 0;
}


