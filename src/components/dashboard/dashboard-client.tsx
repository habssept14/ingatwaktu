"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, ListTodo, TrendingUp, Sparkles, Target, Flame } from "lucide-react";
import Link from "next/link";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskQuickAdd } from "@/components/tasks/task-quick-add";
import { getStreak } from "@/lib/utils";
import { useMemo } from "react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  scheduledStart: string | null;
  scheduledEnd: string | null;
  dueDate: string | null;
  estimateMinutes: number;
  category: { id: string; name: string; color: string; icon: string } | null;
  subtasks: { id: string; isDone: boolean }[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  _count: { tasks: number };
}

interface Habit {
  id: string;
  name: string;
  color: string;
  logs: { loggedAt: string }[];
}

interface DashboardClientProps {
  userName: string;
  todaysTasks: Task[];
  categories: Category[];
  habits: Habit[];
  stats: {
    completedToday: number;
    inProgressToday: number;
    pendingToday: number;
    totalToday: number;
    completedThisWeek: number;
  };
}

export function DashboardClient({ userName, todaysTasks, categories, habits, stats }: DashboardClientProps) {
  const completionRate = stats.totalToday > 0 ? Math.round((stats.completedToday / stats.totalToday) * 100) : 0;

  const habitStreak = useMemo(() => {
    const allLogs = habits.flatMap((h) => h.logs.map((l) => new Date(l.loggedAt)));
    return getStreak(allLogs);
  }, [habits]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Selamat pagi";
    if (h < 18) return "Selamat siang";
    return "Selamat malam";
  })();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <p className="text-sm text-[hsl(var(--bone-muted))]">{greeting},</p>
        <h1 className="font-heading text-3xl font-bold text-[hsl(var(--bone))] md:text-4xl">
          {userName.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-[hsl(var(--bone-muted))]">
          {stats.totalToday === 0
            ? "Belum ada jadwal hari ini. Tambahkan satu untuk memulai."
            : `${stats.completedToday} dari ${stats.totalToday} tugas selesai hari ini.`}
        </p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Selesai"
          value={stats.completedToday}
          color="success"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Berjalan"
          value={stats.inProgressToday}
          color="primary"
          delay={0.05}
        />
        <StatCard
          icon={ListTodo}
          label="Belum mulai"
          value={stats.pendingToday}
          color="warning"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${habitStreak}`}
          suffix=" hari"
          color="gold"
          delay={0.15}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-[hsl(var(--bone))]">
              Jadwal Hari Ini
            </h2>
            <Link
              href="/tasks"
              className="text-sm font-medium text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-light))] transition-colors"
            >
              Lihat semua →
            </Link>
          </div>

          <TaskQuickAdd categories={categories} />

          {todaysTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/40 p-12 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10">
                <Sparkles className="h-8 w-8 text-[hsl(var(--primary))]" />
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-[hsl(var(--bone))]">
                Belum ada jadwal
              </h3>
              <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
                Tambahkan tugas pertama kamu di atas untuk memulai.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {todaysTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <TaskCard task={task} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-4">
          {/* Progress card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[hsl(var(--bone))]">Progres Hari Ini</h3>
              <span className="font-heading text-2xl font-bold text-[hsl(var(--primary))]">
                {completionRate}%
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[hsl(var(--bg-deep))]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-light))]"
              />
            </div>
            <p className="mt-3 text-xs text-[hsl(var(--bone-subtle))]">
              {stats.completedThisWeek} tugas selesai dalam 7 hari terakhir.
            </p>
          </motion.div>

          {/* Habits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[hsl(var(--bone))] flex items-center gap-2">
                <Target className="h-4 w-4 text-[hsl(var(--accent-gold))]" />
                Kebiasaan
              </h3>
              <Link href="/habits" className="text-xs text-[hsl(var(--primary))] hover:text-[hsl(var(--primary-light))] transition-colors">
                Kelola
              </Link>
            </div>
            {habits.length === 0 ? (
              <p className="mt-3 text-sm text-[hsl(var(--bone-muted))]">Belum ada kebiasaan.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {habits.slice(0, 4).map((h) => {
                  const today = new Date().toDateString();
                  const doneToday = h.logs.some((l) => new Date(l.loggedAt).toDateString() === today);
                  return (
                    <div key={h.id} className="flex items-center justify-between rounded-lg bg-[hsl(var(--bg-deep))] px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: h.color }} />
                        <span className="text-sm text-[hsl(var(--bone))]">{h.name}</span>
                      </div>
                      {doneToday ? (
                        <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
                      ) : (
                        <span className="text-xs text-[hsl(var(--bone-subtle))]">–</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-5"
          >
            <h3 className="font-medium text-[hsl(var(--bone))] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[hsl(var(--primary))]" />
              Kategori
            </h3>
            <div className="mt-3 space-y-2">
              {categories.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-[hsl(var(--bg-deep))] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-sm text-[hsl(var(--bone))]">{c.name}</span>
                  </div>
                  <span className="font-mono text-xs text-[hsl(var(--bone-subtle))]">{c._count.tasks}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  suffix?: string;
  color: "primary" | "success" | "warning" | "gold";
  delay?: number;
}

function StatCard({ icon: Icon, label, value, suffix, color, delay = 0 }: StatCardProps) {
  const colorMap = {
    primary: { bg: "bg-[hsl(var(--primary))]/10", text: "text-[hsl(var(--primary))]" },
    success: { bg: "bg-[hsl(var(--success))]/10", text: "text-[hsl(var(--success))]" },
    warning: { bg: "bg-[hsl(var(--warning))]/10", text: "text-[hsl(var(--warning))]" },
    gold: { bg: "bg-[hsl(var(--accent-gold))]/10", text: "text-[hsl(var(--accent-gold))]" },
  };
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-4 md:p-5"
    >
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-4.5 w-4.5 ${c.text}`} />
        </div>
      </div>
      <p className="mt-3 text-xs text-[hsl(var(--bone-muted))]">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-[hsl(var(--bone))] md:text-3xl">
        {value}
        {suffix && <span className="ml-1 text-sm font-normal text-[hsl(var(--bone-subtle))]">{suffix}</span>}
      </p>
    </motion.div>
  );
}