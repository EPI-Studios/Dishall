import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth.server";

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Unauthorized
  }

  try {
    const user = await prisma.user.findUnique({
      where: { discord_id: currentUser.sub },
      select: { servers: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 }); // Not found
    }

    return NextResponse.json(user.servers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Server error
  }
}