"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Filter, ListTodo } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskQuickAdd } from "@/components/tasks/task-quick-add";

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
}

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[hsl(var(--bone-muted))]">Memuat...</div>}>
      <TasksContent />
    </Suspense>
  );
}

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldOpenNew = searchParams.get("new") === "1";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "TODO" | "IN_PROGRESS" | "DONE">("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadTasks = async () => {
    try {
      const res = await fetch(`/api/tasks${filter !== "all" ? `?status=${filter}` : ""}`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadTasks();
    loadCategories();
  }, [filter]);

  useEffect(() => {
    if (shouldOpenNew) {
      setDialogOpen(true);
      router.replace("/tasks");
    }
  }, [shouldOpenNew, router]);

  useEffect(() => {
    const handler = () => loadTasks();
    window.addEventListener("task:created", handler);
    return () => window.removeEventListener("task:created", handler);
  }, [filter]);

  const counts = {
    all: tasks.length,
    TODO: tasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    DONE: tasks.filter((t) => t.status === "DONE").length,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[hsl(var(--bone))]">
            Daftar Tugas
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
            {tasks.length} tugas · {counts.DONE} selesai
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className="flex h-11 items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-5 text-sm font-semibold text-white shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary-dark))] transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Tugas Baru</span>
        </button>
      </div>

      <TaskQuickAdd categories={categories} />

      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {(["all", "TODO", "IN_PROGRESS", "DONE"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              filter === f
                ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--bone))]"
                : "border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))]"
            }`}
          >
            {f === "all" ? "Semua" : f === "TODO" ? "Belum mulai" : f === "IN_PROGRESS" ? "Berjalan" : "Selesai"}
            <span className="rounded-full bg-[hsl(var(--bg-deep))] px-2 py-0.5 text-xs">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-[hsl(var(--bg-elevated))]" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/40 p-12 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10">
            <ListTodo className="h-8 w-8 text-[hsl(var(--primary))]" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-semibold text-[hsl(var(--bone))]">
            Tidak ada tugas
          </h3>
          <p className="mt-1 text-sm text-[hsl(var(--bone-muted))]">
            {filter === "all" ? "Tambahkan tugas pertamamu." : `Tidak ada tugas dengan status "${filter}".`}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={loadTasks} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onSuccess={loadTasks} />
    </div>
  );
}