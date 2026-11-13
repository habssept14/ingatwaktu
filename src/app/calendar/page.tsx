"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { TaskDialog } from "@/components/tasks/task-dialog";

interface Task {
  id: string;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  scheduledStart: string | null;
  scheduledEnd: string | null;
  dueDate: string | null;
  estimateMinutes: number;
  category: { id: string; name: string; color: string; icon: string } | null;
  subtasks: { id: string; isDone: boolean }[];
  description: string | null;
}

type ViewMode = "week" | "month";

export default function CalendarPage() {
  const [view, setView] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const loadTasks = async (start: Date, end: Date) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks?from=${start.toISOString()}&to=${end.toISOString()}`);
      const data = await res.json();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  const range = useMemo(() => {
    if (view === "week") {
      return { start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), 6) };
    }
    return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
  }, [view, currentDate]);

  useEffect(() => {
    loadTasks(range.start, range.end);
  }, [range]);

  const navigate = (delta: number) => {
    setCurrentDate((d) => (view === "week" ? addWeeks(d, delta) : new Date(d.getFullYear(), d.getMonth() + delta, 1)));
  };

  const tasksForDay = (day: Date) =>
    tasks.filter((t) => {
      if (t.scheduledStart && isSameDay(new Date(t.scheduledStart), day)) return true;
      if (t.dueDate && isSameDay(new Date(t.dueDate), day)) return true;
      return false;
    });

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[hsl(var(--bone))]">Kalender</h1>
          <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
            {view === "week"
              ? `Minggu ${format(range.start, "d MMM", { locale: localeId })} — ${format(range.end, "d MMM yyyy", { locale: localeId })}`
              : format(currentDate, "MMMM yyyy", { locale: localeId })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-1">
            {(["week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  view === v
                    ? "bg-[hsl(var(--primary))] text-white shadow-[0_2px_8px_hsl(var(--primary)/0.3)]"
                    : "text-[hsl(var(--bone-muted))] hover:text-[hsl(var(--bone))]"
                }`}
              >
                {v === "week" ? "Minggu" : "Bulan"}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-1">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-1.5 text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-all"
            >
              Hari ini
            </button>
            <button
              onClick={() => navigate(1)}
              className="rounded-lg p-1.5 text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-[hsl(var(--bg-elevated))]" />
      ) : view === "week" ? (
        <WeekView currentDate={currentDate} tasksForDay={tasksForDay} onSelectDay={setSelectedDay} />
      ) : (
        <MonthView currentDate={currentDate} tasksForDay={tasksForDay} onSelectDay={setSelectedDay} />
      )}

      {selectedDay && (
        <DayDetailDialog day={selectedDay} tasks={tasksForDay(selectedDay)} onClose={() => setSelectedDay(null)} onRefresh={() => loadTasks(range.start, range.end)} />
      )}
    </div>
  );
}

function WeekView({ currentDate, tasksForDay, onSelectDay }: { currentDate: Date; tasksForDay: (d: Date) => Task[]; onSelectDay: (d: Date) => void }) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am to 8pm

  return (
    <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]">
      <div className="grid grid-cols-8 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))]/50">
        <div className="border-r border-[hsl(var(--border))] p-2 text-xs font-medium text-[hsl(var(--bone-subtle))]">Waktu</div>
        {days.map((day) => (
          <button
            key={day.toISOString()}
            onClick={() => onSelectDay(day)}
            className={`border-r border-[hsl(var(--border))] p-3 text-center transition-colors last:border-r-0 hover:bg-[hsl(var(--bg-hover))] ${
              isToday(day) ? "bg-[hsl(var(--primary))]/10" : ""
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-[hsl(var(--bone-muted))]">{format(day, "EEE", { locale: localeId })}</p>
            <p className={`mt-1 font-heading text-lg font-bold ${isToday(day) ? "text-[hsl(var(--primary))]" : "text-[hsl(var(--bone))]"}`}>
              {format(day, "d")}
            </p>
          </button>
        ))}
      </div>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-[hsl(var(--border))] last:border-b-0" style={{ minHeight: "60px" }}>
            <div className="border-r border-[hsl(var(--border))] p-2 text-right">
              <span className="font-mono text-xs text-[hsl(var(--bone-subtle))]">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
            {days.map((day) => {
              const cellTasks = tasksForDay(day).filter((t) => {
                if (!t.scheduledStart) return false;
                return new Date(t.scheduledStart).getHours() === hour;
              });
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => onSelectDay(day)}
                  className="cursor-pointer border-r border-[hsl(var(--border))] p-1 last:border-r-0 hover:bg-[hsl(var(--bg-hover))]/30"
                >
                  {cellTasks.map((task) => (
                    <TaskBlock key={task.id} task={task} />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthView({ currentDate, tasksForDay, onSelectDay }: { currentDate: Date; tasksForDay: (d: Date) => Task[]; onSelectDay: (d: Date) => void }) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = (monthStart.getDay() + 6) % 7; // Monday = 0
  const paddedDays: (Date | null)[] = [...Array(startDayOfWeek).fill(null), ...days];

  return (
    <div className="overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]">
      <div className="grid grid-cols-7 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))]/50">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
          <div key={d} className="p-2 text-center text-xs font-medium text-[hsl(var(--bone-muted))]">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {paddedDays.map((day, i) => {
          if (!day) return <div key={i} className="aspect-square border-r border-b border-[hsl(var(--border))]" />;
          const dayTasks = tasksForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDay(day)}
              className={`group relative aspect-square border-r border-b border-[hsl(var(--border))] p-2 text-left transition-colors hover:bg-[hsl(var(--bg-hover))]/40 ${
                !isCurrentMonth ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                    isToday(day)
                      ? "bg-[hsl(var(--primary))] text-white shadow-[0_2px_8px_hsl(var(--primary)/0.4)]"
                      : "text-[hsl(var(--bone))]"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>
              {dayTasks.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="truncate rounded px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${t.category?.color || "#2E86DE"}25`,
                        color: t.category?.color || "#2E86DE",
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-[hsl(var(--bone-subtle))]">+{dayTasks.length - 3} lainnya</div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TaskBlock({ task }: { task: Task }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`cursor-pointer truncate rounded-md px-2 py-1 text-xs font-medium ${
        task.status === "DONE" ? "opacity-60 line-through" : ""
      }`}
      style={{
        backgroundColor: `${task.category?.color || "#2E86DE"}25`,
        color: task.category?.color || "#2E86DE",
        borderLeft: `3px solid ${task.category?.color || "#2E86DE"}`,
      }}
      title={task.title}
    >
      {task.title}
    </motion.div>
  );
}

function DayDetailDialog({ day, tasks, onClose, onRefresh }: { day: Date; tasks: Task[]; onClose: () => void; onRefresh: () => void }) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 bg-[hsl(var(--bg-deep))]/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="fixed left-1/2 top-1/2 z-50 max-h-[80vh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] shadow-2xl"
      >
        <div className="border-b border-[hsl(var(--border))] px-6 py-4">
          <h3 className="font-heading text-lg font-semibold text-[hsl(var(--bone))]">
            {format(day, "EEEE, d MMMM yyyy", { locale: localeId })}
          </h3>
          <p className="mt-0.5 text-xs text-[hsl(var(--bone-muted))]">
            {tasks.length} tugas
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-4 space-y-2">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[hsl(var(--border))] p-8 text-center">
              <CalendarIcon className="mx-auto h-8 w-8 text-[hsl(var(--bone-subtle))]" />
              <p className="mt-2 text-sm text-[hsl(var(--bone-muted))]">Tidak ada tugas di tanggal ini.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setEditingTask(task)}
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] p-3 text-left transition-colors hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--bg-hover))]"
              >
                <div className="flex items-center gap-2">
                  {task.category && (
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.category.color }} />
                  )}
                  <p className="font-medium text-[hsl(var(--bone))]">{task.title}</p>
                </div>
                {task.scheduledStart && (
                  <p className="mt-1 text-xs text-[hsl(var(--bone-muted))]">
                    {format(new Date(task.scheduledStart), "HH:mm")}
                    {task.scheduledEnd && ` — ${format(new Date(task.scheduledEnd), "HH:mm")}`}
                  </p>
                )}
              </button>
            ))
          )}
        </div>

        <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))]/50 px-6 py-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl border border-[hsl(var(--border))] py-2 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))] transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>

      {editingTask && (
        <TaskDialog
          open={!!editingTask}
          onOpenChange={(o) => !o && setEditingTask(null)}
          task={editingTask}
          onSuccess={() => {
            onRefresh();
            setEditingTask(null);
          }}
        />
      )}
    </>
  );
}