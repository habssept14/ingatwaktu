"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Briefcase, BookOpen } from "lucide-react";

export function LandingPreview() {
  return (
    <section id="preview" className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute -inset-x-4 -top-8 -bottom-8 rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))]/10 via-transparent to-[hsl(var(--accent-gold))]/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/80 p-4 shadow-2xl backdrop-blur-xl md:p-8">
            {/* Mockup window chrome */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[hsl(0_84%_60%)]" />
              <div className="h-3 w-3 rounded-full bg-[hsl(38_92%_50%)]" />
              <div className="h-3 w-3 rounded-full bg-[hsl(142_76%_36%)]" />
              <div className="ml-4 flex-1 rounded-md bg-[hsl(var(--bg-deep))] px-3 py-1.5 text-xs text-[hsl(var(--bone-subtle))]">
                ingatwaktu.id/dashboard
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Time block column */}
              <div className="lg:col-span-2 space-y-3">
                <h4 className="font-heading text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[hsl(var(--primary))]" />
                  Hari Ini, 24 Agustus
                </h4>

                <PreviewBlock
                  icon={Briefcase}
                  title="Morning standup dengan tim"
                  time="09:00 — 09:30"
                  category="Kerja"
                  color="#2E86DE"
                  status="done"
                />
                <PreviewBlock
                  icon={BookOpen}
                  title="Belajar Next.js App Router"
                  time="16:00 — 17:30"
                  category="Belajar"
                  color="#A855F7"
                  status="active"
                />
                <PreviewBlock
                  icon={Clock}
                  title="Review code PR #142"
                  time="14:00 — 15:00"
                  category="Kerja"
                  color="#2E86DE"
                  status="pending"
                />
              </div>

              {/* Sidebar mini */}
              <div className="space-y-3">
                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] p-4">
                  <p className="text-xs text-[hsl(var(--bone-subtle))]">Selesai hari ini</p>
                  <p className="font-heading text-3xl font-bold text-[hsl(var(--success))] mt-1">3 / 5</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-[hsl(var(--bg-hover))]">
                    <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-[hsl(var(--success))] to-emerald-400" />
                  </div>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] p-4">
                  <p className="text-xs text-[hsl(var(--bone-subtle))]">Streak</p>
                  <p className="font-heading text-3xl font-bold text-[hsl(var(--accent-gold))] mt-1">7 hari</p>
                  <div className="mt-2 flex gap-1">
                    {[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0].map((v, i) => (
                      <div key={i} className={`h-2 flex-1 rounded ${v ? 'bg-[hsl(var(--accent-gold))]' : 'bg-[hsl(var(--bg-hover))]'}`} />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] p-4">
                  <p className="text-xs text-[hsl(var(--bone-subtle))] mb-3">Kategori</p>
                  {[
                    { name: "Kerja", color: "#2E86DE", count: 4 },
                    { name: "Belajar", color: "#A855F7", count: 2 },
                    { name: "Kesehatan", color: "#EF4444", count: 1 },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center justify-between py-1.5 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-[hsl(var(--bone-muted))]">{c.name}</span>
                      </span>
                      <span className="text-[hsl(var(--bone-subtle))] font-mono text-xs">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PreviewBlock({
  icon: Icon,
  title,
  time,
  category,
  color,
  status,
}: {
  icon: any;
  title: string;
  time: string;
  category: string;
  color: string;
  status: "done" | "active" | "pending";
}) {
  const opacity = status === "done" ? "opacity-60" : status === "active" ? "" : "opacity-90";
  const statusBadge = status === "done" ? (
    <CheckCircle2 className="h-4 w-4 text-[hsl(var(--success))]" />
  ) : status === "active" ? (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--primary))] opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--primary))]" />
    </span>
  ) : null;

  return (
    <div className={`flex items-center gap-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))] p-3 ${opacity}`}>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${status === "done" ? "line-through text-[hsl(var(--bone-subtle))]" : "text-[hsl(var(--bone))]"}`}>
          {title}
        </p>
        <p className="text-xs text-[hsl(var(--bone-subtle))] mt-0.5">
          {time} • <span style={{ color }}>{category}</span>
        </p>
      </div>
      {statusBadge}
    </div>
  );
}