// À placer dans : lib/mod_actions/mod_action.server.ts
import "server-only";

import { getCurrentUser } from "../auth/auth.server";
import { prisma } from "../prisma";

const PAGE_SIZE = 10;

// Les colonnes uuid sont typées @db.Uuid : un identifiant mal formé ferait planter toute la page
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type TargetInfo =
  | { kind: "server"; uuid: string; name: string }
  | {
      kind: "review";
      comment: string;
      rate: number;
      authorPseudo: string | null; // null si l'auteur a été supprimé
      serverUuid: string;
      serverName: string;
    }
  | { kind: "user"; pseudo: string };

export async function getAllModAction(page = 1) {
  const current = await getCurrentUser();
  if (!current) return null;

  const user = await prisma.user.findUnique({
    where: { discord_id: current.sub },
    select: { role: true },
  });
  if (user?.role !== "admin" && user?.role !== "moderator") return null;

  const [actions, total] = await prisma.$transaction([
    prisma.mod_Action.findMany({
      orderBy: [{ created_at: "desc" }, { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        uuid: true,
        action: true,
        type: true,
        target: true,
        reason: true,
        created_at: true,
        user: { select: { pseudo: true } },
      },
    }),
    prisma.mod_Action.count(),
  ]);

  // Une requête par type de cible pour toute la page (pas une requête par ligne)
  const targetsOfType = (type: string) =>
    actions.filter((a) => a.type === type).map((a) => a.target);

  const serverIds = targetsOfType("server").filter((id) => UUID_RE.test(id));
  const reviewIds = targetsOfType("review").filter((id) => UUID_RE.test(id));
  const userIds = targetsOfType("user"); // discord_id : pas un uuid

  const [servers, reviews, users] = await Promise.all([
    serverIds.length
      ? prisma.server.findMany({
          where: { uuid: { in: serverIds } },
          select: { uuid: true, name: true },
        })
      : [],
    reviewIds.length
      ? prisma.critic.findMany({
          where: { uuid: { in: reviewIds } },
          select: {
            uuid: true,
            comment: true,
            rate: true,
            user: { select: { pseudo: true } },
            server: { select: { uuid: true, name: true } },
          },
        })
      : [],
    userIds.length
      ? prisma.user.findMany({
          where: { discord_id: { in: userIds } },
          select: { discord_id: true, pseudo: true },
        })
      : [],
  ]);

  const serverMap = new Map(servers.map((s) => [s.uuid, s]));
  const reviewMap = new Map(reviews.map((r) => [r.uuid, r]));
  const userMap = new Map(users.map((u) => [u.discord_id, u]));

  function resolveTarget(type: string, target: string): TargetInfo | null {
    if (type === "server") {
      const s = serverMap.get(target);
      return s ? { kind: "server", uuid: s.uuid, name: s.name } : null;
    }

    if (type === "review") {
      const r = reviewMap.get(target);
      return r
        ? {
            kind: "review",
            comment: r.comment,
            rate: r.rate,
            authorPseudo: r.user?.pseudo ?? null,
            serverUuid: r.server.uuid,
            serverName: r.server.name,
          }
        : null;
    }

    if (type === "user") {
      const u = userMap.get(target);
      return u ? { kind: "user", pseudo: u.pseudo } : null;
    }

    return null;
  }

  return {
    actions: actions.map((a) => ({
      ...a,
      targetInfo: resolveTarget(a.type, a.target),
    })),
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}