import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";

const statusSchema = z.object({
    status: z.enum(["approved", "pending", "rejected"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }>},
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const me = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { role: true },
  });
  
  if (me?.role !== "admin" && me?.role !== "moderator") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 }); // Forbidden
  }

  const { uuid } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 }); // Bad Request
  }

  const parsed = statusSchema.safeParse(body);  
  if (!parsed.success) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 }); // Bad Request
  }

  try {
    const updatedServer = await prisma.server.update({
      where: { uuid },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(updatedServer)
  } catch (error)  {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 }); // Not Found
    }
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
};