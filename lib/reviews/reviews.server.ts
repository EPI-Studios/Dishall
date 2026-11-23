import type { ReviewType } from "../../@types/type";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth.server";

const PAGE_SIZE = 10;

export async function getReviewsByServerUuid( serverUuid: string ): Promise<ReviewType[]> {
  const httpResponse = await fetch(
    `${process.env.API_URL}/reviews?serverUuid=${serverUuid}`,
  );
  
  if (!httpResponse.ok) {
    throw new Error(`Impossible de charger les avis (${httpResponse.status})`)
  }

  return httpResponse.json();
};

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
