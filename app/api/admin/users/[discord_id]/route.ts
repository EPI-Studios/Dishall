import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/auth.server";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import {
  logModAction,
  reasonSchema,
} from "@/lib/mod_actions/mod_action.server";

const roleSchema = z.object({
  role: z.enum(["member", "moderator"]),
  reason: reasonSchema,
});

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Unauthorized
  }

  const admin = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { role: true },
  });
  if (admin?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 }); // Forbidden
  }

  const { discord_id } = await params;

  if (discord_id === currentUser.sub) {
    return NextResponse.json(
      { error: "Bad request" },
      { status: 400 },
    );
  }

  const target = await prisma.user.findUnique({
    where: { discord_id },
    select: { role: true },
  });

  if (!target) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    ); // Not Found
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }, // Forbidden
    );
  }

  try {
    await prisma.user.delete({ where: { discord_id } });
    return new Response(null, { status: 204 }); // No content
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Not found" },
          { status: 404 },
        );
      }
    }

    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 }); // Server error
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ discord_id: string }> },
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Unauthorized
  }

  const admin = await prisma.user.findUnique({
    where: { discord_id: currentUser.sub },
    select: { uuid: true, role: true },
  });

  if (admin?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 }); // Forbidden
  }

  const { discord_id } = await params;

  if (discord_id === currentUser.sub) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 }); // Bad Request
  }

  const parsed = roleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 }); // Bad Request
  }

  const { role, reason } = parsed.data;

  const target = await prisma.user.findUnique({
    where: { discord_id },
    select: { role: true },
  });

  if (!target) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    ); // Not Found
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }, // Forbidden
    );
  }

  try {
    const [updatedUser] = await prisma.$transaction([
      prisma.user.update({ where: { discord_id }, data: { role } }),
      logModAction({
        moderatorUuid: admin.uuid,
        action: "role_change",
        type: "user",
        target: discord_id,
        reason: `${target.role} → ${role} : ${reason}`,
      }),
    ]);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
