"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, LogOut } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  timezone: string;
  wakeTime: string;
  sleepTime: string;
}

export function SettingsForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name);
  const [avatarColor, setAvatarColor] = useState(user.avatarColor);
  const [wakeTime, setWakeTime] = useState(user.wakeTime);
  const [sleepTime, setSleepTime] = useState(user.sleepTime);
  const [loading, setLoading] = useState(false);

  const colors = ["#2E86DE", "#10B981", "#A855F7", "#EF4444", "#D4A843", "#F97316", "#EC4899"];

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, avatarColor, wakeTime, sleepTime }),
      });
      if (!res.ok) throw new Error();
      toast.success("Pengaturan disimpan");
      window.location.reload();
    } catch {
      toast.error("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-6 space-y-4"
      >
        <h3 className="font-heading text-lg font-semibold text-[hsl(var(--bone))]">Profil</h3>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))/0.2]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone-muted))] opacity-60 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Warna Avatar</label>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setAvatarColor(c)}
                className={`h-10 w-10 rounded-full transition-all ${avatarColor === c ? "ring-2 ring-offset-2 ring-offset-[hsl(var(--bg-elevated))] scale-110" : ""}`}
                style={{ backgroundColor: c, ["--tw-ring-color" as any]: c }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] p-6 space-y-4"
      >
        <h3 className="font-heading text-lg font-semibold text-[hsl(var(--bone))]">Preferensi Waktu</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Jam Bangun</label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Jam Tidur</label>
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] px-4 text-sm text-[hsl(var(--bone))] focus:border-[hsl(var(--primary))] focus:outline-none"
            />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary-dark))] transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] px-6 py-3 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))] transition-all"
        >
          <LogOut className="h-4 w-4" />
          Keluar
        </button>
      </div>
    </div>
  );
}