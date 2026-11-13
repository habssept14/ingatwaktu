import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    include: { logs: { orderBy: { loggedAt: "desc" } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(habits);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, color = "#10B981", icon = "check" } = await req.json();
  if (!name) return NextResponse.json({ error: "Nama wajib diisi" }, { status: 400 });

  try {
    const habit = await prisma.habit.create({
      data: { userId: session.user.id, name, color, icon },
    });
    return NextResponse.json(habit, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Nama sudah ada" }, { status: 400 });
  }
}