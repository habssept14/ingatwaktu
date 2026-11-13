"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Check, X, Flame } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  streak: number;
  doneToday: boolean;
  totalLogs: number;
}

export function HabitManager({ habits }: { habits: Habit[] }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#10B981");
  const [loading, setLoading] = useState(false);

  const colors = ["#10B981", "#2E86DE", "#A855F7", "#EF4444", "#D4A843", "#F97316", "#EC4899"];

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), color: newColor }),
      });
      if (!res.ok) throw new Error();
      toast.success("Kebiasaan ditambahkan");
      setNewName("");
      setAdding(false);
      window.location.reload();
    } catch {
      toast.error("Gagal menambah");
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async (id: string) => {
    try {
      const res = await fetch(`/api/habits/${id}/log`, { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Tercatat ✓");
      window.location.reload();
    } catch {
      toast.error("Gagal mencatat");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kebiasaan ini?")) return;
    try {
      const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Dihapus");
      window.location.reload();
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  return (
    <div className="space-y-4">
      {!adding ? (
        <button
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/40 py-4 text-sm font-medium text-[hsl(var(--bone-muted))] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-all"
        >
          <Plus className="h-4 w-4" />
          Tambah kebiasaan baru
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-4 space-y-3"
        >
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama kebiasaan..."
            className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
            autoFocus
          />
          <div className="flex items-center gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className={cn(
                  "h-8 w-8 rounded-full transition-all",
                  newColor === c ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--bg-elevated))] scale-110" : ""
                )}
                style={{ backgroundColor: c, ["--tw-ring-color" as any]: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAdding(false);
                setNewName("");
              }}
              className="flex-1 rounded-xl border border-[hsl(var(--border))] py-2 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))]"
            >
              Batal
            </button>
            <button
              onClick={handleAdd}
              disabled={loading || !newName.trim()}
              className="flex-1 rounded-xl bg-[hsl(var(--primary))] py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "..." : "Tambah"}
            </button>
          </div>
        </motion.div>
      )}

      {habits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/40 p-12 text-center">
          <Flame className="mx-auto h-10 w-10 text-[hsl(var(--accent-gold))]" />
          <p className="mt-3 text-sm text-[hsl(var(--bone-muted))]">
            Mulai dengan kebiasaan sederhana seperti "Minum air" atau "Baca 10 menit".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {habits.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-4 transition-all hover:border-[hsl(var(--primary))]/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 shrink-0 rounded-xl" style={{ backgroundColor: `${habit.color}25` }}>
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: habit.color }} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[hsl(var(--bone))] truncate">{habit.name}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-[hsl(var(--bone-muted))]">
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3" style={{ color: habit.color }} />
                        {habit.streak} hari
                      </span>
                      <span>·</span>
                      <span>{habit.totalLogs} total</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="rounded-lg p-1.5 text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--destructive))]/10 hover:text-[hsl(var(--destructive))] transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => handleLog(habit.id)}
                disabled={habit.doneToday}
                className={cn(
                  "mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-all",
                  habit.doneToday
                    ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] cursor-default"
                    : "bg-[hsl(var(--bg-deep))] text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))]"
                )}
              >
                {habit.doneToday ? (
                  <>
                    <Check className="h-4 w-4" />
                    Selesai hari ini
                  </>
                ) : (
                  "Tandai selesai hari ini"
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}