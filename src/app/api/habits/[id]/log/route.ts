import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Verify ownership
  const habit = await prisma.habit.findFirst({ where: { id, userId: session.user.id } });
  if (!habit) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check if already logged today
  const today = startOfDay(new Date());
  const existing = await prisma.habitLog.findFirst({
    where: { habitId: id, loggedAt: { gte: today } },
  });

  if (existing) {
    // Untoggle: delete today's log
    await prisma.habitLog.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true, action: "removed" });
  }

  await prisma.habitLog.create({ data: { habitId: id, loggedAt: new Date() } });
  return NextResponse.json({ success: true, action: "added" });
}