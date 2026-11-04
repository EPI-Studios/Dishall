import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET() {
  const servers = await prisma.server.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        }
      }
    }
  });

  return NextResponse.json(servers);
}
