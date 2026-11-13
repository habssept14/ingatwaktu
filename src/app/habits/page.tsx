import { requireAuth } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { subDays, format, startOfDay, differenceInDays } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CheckCircle2, Plus, Flame, Target } from "lucide-react";
import { HabitManager } from "@/components/habits/habit-manager";

export const dynamic = "force-dynamic";

export default async function HabitsPage() {
  const user = await requireAuth();
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: { logs: { orderBy: { loggedAt: "desc" } } },
    orderBy: { name: "asc" },
  });

  // Calculate streaks
  const today = startOfDay(new Date());
  const habitsWithStats = habits.map((h) => {
    const uniqueDays = Array.from(new Set(h.logs.map((l) => startOfDay(l.loggedAt).toISOString()))).sort().reverse();
    let streak = 0;
    let current = today;
    for (const dayStr of uniqueDays) {
      const day = new Date(dayStr);
      if (day.getTime() === current.getTime()) {
        streak++;
        current = subDays(current, 1);
      } else if (day.getTime() === current.getTime() + 86400000) {
        // skip today if not logged, allow grace
        continue;
      } else {
        break;
      }
    }
    const doneToday = h.logs.some((l) => startOfDay(l.loggedAt).getTime() === today.getTime());
    return {
      ...h,
      streak,
      doneToday,
      totalLogs: h.logs.length,
    };
  });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[hsl(var(--bone))]">Kebiasaan</h1>
        <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
          Bangun konsistensi, satu hari pada satu waktu.
        </p>
      </div>

      <HabitManager habits={habitsWithStats.map((h) => ({
        id: h.id,
        name: h.name,
        color: h.color,
        icon: h.icon,
        streak: h.streak,
        doneToday: h.doneToday,
        totalLogs: h.totalLogs,
      }))} />
    </div>
  );
}