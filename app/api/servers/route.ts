import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function average(rates: number[]) {
  return rates.length
    ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length
    : 0;
}

export async function GET() {
  const servers = await prisma.server.findMany({
    where: { status: "approved" },
    select: {
      uuid: true,
      guild_id: true,
      name: true,
      description: true,
      link: true,
      category: true,
      country: true,
      icon: true,
      banner: true,
      status: true,
      created_at: true,
      tags: { select: { tag: { select: { name: true } } } },
      serverStats: { select: { users_nb: true, server_bump: true } },
      critics: { where: { status: "approved" }, select: { rate: true } },
    },
  });

  const result = servers.map(({ tags, serverStats, critics, ...server }) => ({
    ...server,
    members: serverStats?.users_nb ?? 0,
    bumped: serverStats?.server_bump,
    tags: tags.map((serverTag) => serverTag.tag.name),
    rating: average(critics.map((c) => c.rate)),
    reviewCount: critics.length,
  }));

  return NextResponse.json(result);
}
