"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Save } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

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
  category: { id: string; name: string; color: string } | null;
  subtasks: { id: string; isDone: boolean }[];
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSuccess?: () => void;
  defaultCategoryId?: string;
}

export function TaskDialog({ open, onOpenChange, task, onSuccess }: TaskDialogProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(task?.priority || "MEDIUM");
  const [categoryId, setCategoryId] = useState<string>(task?.category?.id || "");
  const [date, setDate] = useState(task?.scheduledStart ? format(new Date(task.scheduledStart), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"));
  const [startTime, setStartTime] = useState(task?.scheduledStart ? format(new Date(task.scheduledStart), "HH:mm") : "09:00");
  const [endTime, setEndTime] = useState(task?.scheduledEnd ? format(new Date(task.scheduledEnd), "HH:mm") : "10:00");
  const [estimate, setEstimate] = useState(task?.estimateMinutes || 30);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (!task && data.length > 0 && !categoryId) {
          setCategoryId(data[0].id);
        }
      })
      .catch(() => {});
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const start = `${date}T${startTime}:00.000Z`;
    const end = `${date}T${endTime}:00.000Z`;

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      categoryId: categoryId || undefined,
      status: task?.status || "TODO",
      scheduledStart: start,
      scheduledEnd: end,
      estimateMinutes: estimate,
    };

    try {
      const url = task ? `/api/tasks/${task.id}` : "/api/tasks";
      const method = task ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }

      toast.success(task ? "Tugas diperbarui" : "Tugas dibuat");
      onSuccess?.();
      onOpenChange(false);
      window.dispatchEvent(new Event("task:created"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[hsl(var(--bg-deep))]/80 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] shadow-2xl"
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
                <h2 className="font-heading text-lg font-semibold text-[hsl(var(--bone))]">
                  {task ? "Edit Tugas" : "Tugas Baru"}
                </h2>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg p-1.5 text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-6 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">Judul</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Apa yang ingin kamu kerjakan?"
                    className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] placeholder:text-[hsl(var(--bone-subtle))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">Deskripsi</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail tambahan..."
                    className="flex min-h-[80px] w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 py-3 text-sm text-[hsl(var(--bone))] placeholder:text-[hsl(var(--bone-subtle))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">Kategori</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-3 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
                    >
                      <option value="">Tanpa kategori</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">Prioritas</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                      className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-3 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
                    >
                      <option value="LOW">Rendah</option>
                      <option value="MEDIUM">Sedang</option>
                      <option value="HIGH">Tinggi</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))] flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Waktu
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-3 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
                    />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-3 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
                    />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-3 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[hsl(var(--bone))]">
                    Estimasi durasi (menit)
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={estimate}
                    onChange={(e) => setEstimate(parseInt(e.target.value) || 30)}
                    className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
                  />
                </div>
              </div>

              <div className="flex gap-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))]/50 px-6 py-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-transparent px-4 py-2.5 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))] transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary-dark))] transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}