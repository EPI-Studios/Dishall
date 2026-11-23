import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { isReservedPseudo } from "@/util/pseudo";
import { Prisma } from "@/generated/prisma/client";

const userDataValidation = z.object({
  pseudo: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .refine((p) => !isReservedPseudo(p), "Ce pseudo est déjà pris") 
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Unauthorized
  }

  const { discord_id } = await params;

  if (currentUser.sub !== discord_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 }); // Forbidden
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
  
  const { data, error } = await userDataValidation.safeParseAsync(body);

  if (error) {
    return NextResponse.json(
      { error: "Bad request", details: error.issues },
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Conflict" }, { status: 409 }); // Conflict
    }

    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Server Error
  }
}

