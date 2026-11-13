"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, Clock, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn, formatTime, getPriorityColor, getPriorityLabel, getStatusLabel } from "@/lib/utils";
import { TaskDialog } from "./task-dialog";

interface TaskCardProps {
  task: {
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
  };
  onUpdate?: () => void;
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [editing, setEditing] = useState(false);

  const toggleStatus = async () => {
    const next = task.status === "DONE" ? "TODO" : "DONE";
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      toast.success(next === "DONE" ? "Tugas selesai ✓" : "Tugas dibuka kembali");
      onUpdate?.();
    } catch {
      toast.error("Gagal memperbarui tugas");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Hapus tugas ini?")) return;
    try {
      const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Tugas dihapus");
      onUpdate?.();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const completedSubtasks = task.subtasks.filter((s) => s.isDone).length;
  const isDone = task.status === "DONE";

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl border bg-[hsl(var(--bg-elevated))] p-4 transition-all",
          "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]/50 hover:shadow-[0_4px_20px_-8px_hsl(var(--primary)/0.3)]",
          isDone && "opacity-60"
        )}
      >
        {/* Priority stripe */}
        <div
          className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        />

        {/* Status checkbox */}
        <button
          onClick={toggleStatus}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
            isDone
              ? "border-[hsl(var(--success))] bg-[hsl(var(--success))]"
              : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]"
          )}
          aria-label={isDone ? "Buka kembali" : "Selesaikan"}
        >
          {isDone && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
        </button>

        {/* Category indicator */}
        {task.category && (
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${task.category.color}20` }}
            title={task.category.name}
          >
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.category.color }} />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className={cn("font-medium text-[hsl(var(--bone))]", isDone && "line-through")}>
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--bone-muted))]">
            {task.scheduledStart && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(task.scheduledStart)}
                {task.scheduledEnd && ` — ${formatTime(task.scheduledEnd)}`}
              </span>
            )}
            {task.category && (
              <span style={{ color: task.category.color }}>● {task.category.name}</span>
            )}
            <span className="text-[hsl(var(--bone-subtle))]">{getPriorityLabel(task.priority)}</span>
            {task.subtasks.length > 0 && (
              <span className="text-[hsl(var(--bone-subtle))]">
                {completedSubtasks}/{task.subtasks.length} checklist
              </span>
            )}
          </div>
        </div>

        {/* Actions — visible on touch devices, reveal on hover for desktop */}
        <div className="flex items-center gap-1 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg p-2 text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-colors"
            aria-label="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg p-2 text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))] transition-colors"
            aria-label="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <TaskDialog
        open={editing}
        onOpenChange={setEditing}
        task={task}
        onSuccess={onUpdate}
      />
    </>
  );
}