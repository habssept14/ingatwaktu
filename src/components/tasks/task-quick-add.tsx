"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  color: string;
}

export function TaskQuickAdd({ categories }: { categories: Category[] }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          categoryId: categoryId || undefined,
          status: "TODO",
          priority: "MEDIUM",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Tugas ditambahkan");
      setTitle("");
      window.dispatchEvent(new Event("task:created"));
    } catch {
      toast.error("Gagal menambah tugas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-2 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-2"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10">
        <Plus className="h-5 w-5 text-[hsl(var(--primary))]" />
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tambah tugas cepat..."
        className="flex-1 bg-transparent px-2 text-sm text-[hsl(var(--bone))] placeholder:text-[hsl(var(--bone-subtle))] focus:outline-none"
      />
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        className="hidden rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-3 text-xs text-[hsl(var(--bone-muted))] focus:border-[hsl(var(--primary))] focus:outline-none sm:block"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[hsl(var(--primary))] px-4 text-sm font-medium text-white transition-all hover:bg-[hsl(var(--primary-dark))] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        <span className="hidden sm:inline">Tambah</span>
      </button>
    </motion.form>
  );
}