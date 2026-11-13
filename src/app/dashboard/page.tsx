import { requireAuth } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { startOfDay, endOfDay, subDays } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireAuth();
  const today = new Date();
  const dayStart = startOfDay(today);
  const dayEnd = endOfDay(today);

  // Today's tasks
  const todaysTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      OR: [
        { scheduledStart: { gte: dayStart, lte: dayEnd } },
        { dueDate: { gte: dayStart, lte: dayEnd } },
        { status: { in: ["TODO", "IN_PROGRESS"] }, scheduledStart: null, dueDate: null },
      ],
    },
    include: { category: true, subtasks: true },
    orderBy: [{ status: "asc" }, { scheduledStart: "asc" }, { priority: "desc" }],
  });

  // Stats
  const weekAgo = subDays(today, 7);
  const lastWeekTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
      completedAt: { gte: weekAgo },
      status: "DONE",
    },
    select: { completedAt: true, categoryId: true },
  });

  // All categories
  const categories = await prisma.category.findMany({
    where: { userId: user.id },
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: "asc" },
  });

  // Habits
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: { logs: { where: { loggedAt: { gte: subDays(today, 7) } } } },
    orderBy: { name: "asc" },
  });

  const completedToday = todaysTasks.filter((t) => t.status === "DONE").length;
  const inProgressToday = todaysTasks.filter((t) => t.status === "IN_PROGRESS").length;
  const pendingToday = todaysTasks.filter((t) => t.status === "TODO").length;

  return (
    <DashboardClient
      userName={user.name}
      todaysTasks={todaysTasks.map((t) => ({
        ...t,
        status: t.status as "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED",
        priority: t.priority as "LOW" | "MEDIUM" | "HIGH",
        scheduledStart: t.scheduledStart?.toISOString() || null,
        scheduledEnd: t.scheduledEnd?.toISOString() || null,
        dueDate: t.dueDate?.toISOString() || null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        completedAt: t.completedAt?.toISOString() || null,
        category: t.category ? {
          ...t.category,
          createdAt: t.category.createdAt.toISOString(),
        } : null,
      }))}
      categories={categories.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      }))}
      habits={habits.map((h) => ({
        ...h,
        createdAt: h.createdAt.toISOString(),
        logs: h.logs.map((l) => ({ id: l.id, loggedAt: l.loggedAt.toISOString() })),
      }))}
      stats={{
        completedToday,
        inProgressToday,
        pendingToday,
        totalToday: todaysTasks.length,
        completedThisWeek: lastWeekTasks.length,
      }}
    />
  );
}