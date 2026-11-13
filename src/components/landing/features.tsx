"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Target, BarChart3, Layers, Zap } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Kalender Interaktif",
    description: "Lihat jadwal harian, mingguan, dan bulanan dalam satu tampilan yang elegan.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Clock,
    title: "Time Blocking",
    description: "Blok waktu spesifik untuk setiap aktivitas. Fokus tanpa distraksi.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Target,
    title: "Prioritas Jelas",
    description: "Tandai tugas penting. Ingatkan yang sering terlupa dengan gentle reminders.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Layers,
    title: "Kategori Berwarna",
    description: "Kelompokkan aktivitas: kerja, pribadi, ibadah, kesehatan — semuanya terpisah rapi.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: "Statistik & Streak",
    description: "Pantau produktivitas mingguan. Bangun kebiasaan baik dengan streak harian.",
    color: "from-rose-500 to-red-500",
  },
  {
    icon: Zap,
    title: "Fokus Mode",
    description: "Aktifkan mode fokus dengan timer. Hilangkan distraksi, selesaikan satu hal.",
    color: "from-yellow-400 to-amber-500",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-sm font-medium text-[hsl(var(--accent-gold))]">
            Fitur Utama
          </span>
          <h2 className="mt-2 font-heading text-3xl font-bold md:text-5xl text-balance">
            Waktu adalah aset
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary-light))] bg-clip-text text-transparent">
              paling berharga
            </span>
          </h2>
          <p className="mt-4 text-lg text-[hsl(var(--bone-muted))] text-balance">
            Semua yang kamu butuhkan untuk mengatur hari dengan tenang, tanpa ribet.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/60 p-6 backdrop-blur transition-all hover:border-[hsl(var(--primary))]/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.3)]"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[hsl(var(--bone))]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-[hsl(var(--bone-muted))] leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))]/0 via-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/0 opacity-0 transition-opacity group-hover:opacity-100 -z-10 blur-xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}