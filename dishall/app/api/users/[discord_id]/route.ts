import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth.server";

const userDataValidation = z.object({
  pseudo: z.string().trim().min(2).max(50).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
) {
  
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 }); // Unauthorized
  }

  const { discord_id } = await params;

  if (currentUser.sub !== discord_id) {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });  // Forbidden
  }

  const body = await request.json();
  const { data, error } = await userDataValidation.safeParseAsync(body);

  if (error) {
    return NextResponse.json(
      { error: "Données invalides", details: error.issues },
      { status: 400 },
    );
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { discord_id },
      data,
      select: { discord_id: true, pseudo: true, avatar: true },
    });

    return Response.json(updatedUser, { status: 200 }); // OK
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 }); // Server Error
  }
}
