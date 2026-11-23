import type { ReviewType } from "../../@types/type";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { z } from "zod";

const PAGE_SIZE = 10;

export async function getReviewsByServerUuid( serverUuid: string ): Promise<ReviewType[]> {
  if (!z.uuid().safeParse(serverUuid).success) return [];

  const reviews = await prisma.critic.findMany({
    where: { status: "approved", server: { uuid: serverUuid } },
    orderBy: { created_at: "desc" },
    take: 100,
    select: {
      uuid: true,
      rate: true,
      comment: true,
      created_at: true,
      user: { select: { pseudo: true, avatar: true } },
    },
  });

  return reviews.map((review) => ({
    ...review,
    created_at: review.created_at.toISOString(), // ton ReviewType attend une chaîne
  }));
}

export async function getAllReviewsModeration(page = 1) {
  const current = await getCurrentUser();
  if (!current) return null;

  const user = await prisma.user.findUnique({
    where: { discord_id: current.sub },
    select: { role: true },
  });

  if (user?.role !== "admin" && user?.role !== "moderator") return null;

  const [reviews, total] = await prisma.$transaction([
    prisma.critic.findMany({
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        uuid: true,
        comment: true,
        rate: true,
        status: true,
        created_at: true,
        user: { select: { pseudo: true } }, // peut être null
        server: { select: { name: true } },
      },
    }),
    prisma.critic.count(),
  ]);

  return { reviews, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}
