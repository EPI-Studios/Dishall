import "server-only";

import { getCurrentUser } from "../auth/auth.server";
import { prisma } from "../prisma";

export async function getAllUsersForAdmin(page = 1) {
  const current = await getCurrentUser();
  if (!current) return null;

  const admin = await prisma.user.findUnique({
    where: { discord_id: current.sub },
    select: { role: true },
  });
  if (admin?.role !== "admin") return null;

  const PAGE_SIZE = 10;

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      orderBy: [{ role: "desc" }, { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.user.count(),
  ]);

  return { users, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}