import "server-only";

import type { ServerType } from "../../@types/type";
import { getCurrentUser } from "../auth/auth.server";
import { prisma } from "../prisma";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { isBumped } from "@/util/bump";
import { calculateServerScore } from "@/util/score";

const PAGE_SIZE = 10;

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
  serverStats: { select: { users_nb: true, last_bump_at: true } },
  critics: { where: { status: "approved" }, select: { rate: true } },
} satisfies Prisma.ServerSelect;

type PublicServer = Prisma.ServerGetPayload<{ select: typeof publicServerSelect }>;

function toServerType(server: PublicServer): ServerType {
  const rates = server.critics.map((critic) => critic.rate);
  const ratingAvg = rates.length ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : null;

  const members = server.serverStats?.users_nb ?? 0;
  const lastBumpAt = server.serverStats?.last_bump_at ?? null;

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
    members,
    bumped: isBumped(lastBumpAt),
    tags: server.tags.map((serverTag) => serverTag.tag.name),
    rating: ratingAvg ?? 0,
    reviewCount: rates.length,
    score: calculateServerScore({
      ratingAvg,
      members,
      descriptionLength: server.description?.length ?? 0,
      lastBumpAt,
    }),
  };
}

export async function getServers(): Promise<ServerType[]> {
  const servers = await prisma.server.findMany({
    where: { status: "approved" },
    select: publicServerSelect,
  });

  return servers.map(toServerType);
}

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
        description: true,
        status: true,
        guild_id: true,
        icon: true,
        serverStats: { select: { users_nb: true, last_bump_at: true } },
        critics: { where: { status: "approved" }, select: { rate: true } },
      },
    }),
    prisma.server.count(),
  ]);

  return {
    servers: servers.map(({ description, critics, ...server }) => {
    const rates = critics.map((critic) => critic.rate);
    const ratingAvg = rates.length ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length : null;

    return {
      ...server,
      bumped: isBumped(server.serverStats?.last_bump_at),
      score: calculateServerScore({
        ratingAvg,
        members: server.serverStats?.users_nb ?? 0,
        descriptionLength: description?.length ?? 0,
        lastBumpAt: server.serverStats?.last_bump_at ?? null,
      }),
    };
  }),
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function isServerOwner(serverUuid: string): Promise<boolean> {
  const current = await getCurrentUser();
  if (!current) return false;

  const count = await prisma.server.count({
    where: { uuid: serverUuid, user: { discord_id: current.sub } },
  });

  return count > 0;
}