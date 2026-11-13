import { requireAuth } from "@/lib/server-auth";
import { prisma } from "@/lib/prisma";
import { Clock, CheckCircle2, Flame, TrendingUp } from "lucide-react";
import { subDays, format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const user = await requireAuth();
  const now = new Date();
  const weekAgo = subDays(now, 7);
  const monthAgo = subDays(now, 30);

  // Last 7 days completion
  const completedLast7 = await prisma.task.findMany({
    where: { userId: user.id, completedAt: { gte: weekAgo }, status: "DONE" },
    select: { completedAt: true, categoryId: true, estimateMinutes: true },
  });

  // Build heatmap data
  const heatmap = Array.from({ length: 35 }, (_, i) => {
    const date = subDays(now, 34 - i);
    const dateStr = date.toDateString();
    const count = completedLast7.filter((t) => {
      if (!t.completedAt) return false;
      const d = new Date(t.completedAt);
      if (i < 28) return false; // only count last 7
      return d.toDateString() === dateStr;
    }).length;
    return { date, count };
  }).slice(-7);

  // Total stats
  const totalCompletedLast30 = completedLast7.length;
  const totalTimeLast7 = completedLast7.reduce((sum, t) => sum + (t.estimateMinutes || 0), 0);

  // Category breakdown
  const allTasksLast30 = await prisma.task.findMany({
    where: { userId: user.id, createdAt: { gte: monthAgo } },
    include: { category: true },
  });

  const categoryStats = allTasksLast30.reduce((acc, t) => {
    const catName = t.category?.name || "Tanpa kategori";
    const catColor = t.category?.color || "#9B9180";
    if (!acc[catName]) acc[catName] = { name: catName, color: catColor, count: 0, time: 0 };
    acc[catName].count += 1;
    if (t.status === "DONE") acc[catName].time += t.estimateMinutes;
    return acc;
  }, {} as Record<string, { name: string; color: string; count: number; time: number }>);

  const topCategories = Object.values(categoryStats).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxCategoryCount = Math.max(...topCategories.map((c) => c.count), 1);

  // Habit streak
  const habits = await prisma.habit.findMany({
    where: { userId: user.id },
    include: { logs: { where: { loggedAt: { gte: subDays(now, 30) } } } },
  });

  const totalHabitLogs = habits.reduce((sum, h) => sum + h.logs.length, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold text-[hsl(var(--bone))]">Analitik</h1>
        <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
          Pantau produktivitas dan progress kamu
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatBox icon={CheckCircle2} label="Selesai (7 hari)" value={totalCompletedLast30} color="success" />
        <StatBox icon={Clock} label="Waktu fokus" value={`${Math.floor(totalTimeLast7 / 60)}h ${totalTimeLast7 % 60}m`} color="primary" />
        <StatBox icon={Flame} label="Kebiasaan" value={totalHabitLogs} color="gold" />
        <StatBox icon={TrendingUp} label="Rata-rata/hari" value={(totalCompletedLast30 / 7).toFixed(1)} color="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-6">
          <h3 className="font-heading text-lg font-semibold text-[hsl(var(--bone))]">Aktivitas 7 Hari</h3>
          <div className="mt-4 flex items-end justify-between gap-2" style={{ height: "180px" }}>
            {heatmap.map((day, i) => {
              const heightPct = Math.max((day.count / 5) * 100, 4);
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative w-full" style={{ height: "180px" }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-[hsl(var(--primary))] to-[hsl(var(--primary-light))] transition-all hover:opacity-80"
                      style={{ height: `${heightPct}%` }}
                      title={`${day.count} tugas`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[hsl(var(--bone-subtle))]">
                    {format(day.date, "EEE", { locale: localeId })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-6">
          <h3 className="font-heading text-lg font-semibold text-[hsl(var(--bone))]">Distribusi Kategori</h3>
          <div className="mt-4 space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-sm text-[hsl(var(--bone-muted))]">Belum ada data.</p>
            ) : (
              topCategories.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[hsl(var(--bone))]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </span>
                    <span className="font-mono text-xs text-[hsl(var(--bone-subtle))]">
                      {cat.count} tugas
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[hsl(var(--bg-deep))]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(cat.count / maxCategoryCount) * 100}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: "primary" | "success" | "warning" | "gold" }) {
  const colorMap = {
    primary: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
    success: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
    warning: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
    gold: "bg-[hsl(var(--accent-gold))]/10 text-[hsl(var(--accent-gold))]",
  };
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-4 md:p-5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[color]}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <p className="mt-3 text-xs text-[hsl(var(--bone-muted))]">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-[hsl(var(--bone))] md:text-3xl">{value}</p>
    </div>
  );
}