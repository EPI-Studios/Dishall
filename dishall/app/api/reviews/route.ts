import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const serverUuid = new URL(request.url).searchParams.get("serverUuid");

  if (!serverUuid) {
    return NextResponse.json({ error: "serverUuid invalide" }, { status: 400 });
  }

  const reviews = await prisma.critic.findMany({
    where: { status: "approved", server: { uuid: serverUuid } },
    orderBy: { created_at: "desc" },
    include: {
      user: {
        select: {
          pseudo: true,
          avatar: true,
        }
      }
    }
  });

  return NextResponse.json(reviews);
}