"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

export function LandingHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/60 px-4 py-1.5 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent-gold))]" />
            <span className="text-xs font-medium text-[hsl(var(--bone-muted))]">
              Atur waktu, jaga prioritas
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl font-extrabold tracking-tight text-[hsl(var(--bone))] md:text-6xl lg:text-7xl text-balance"
          >
            Ingat Aku,
            <br />
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary-light))] to-[hsl(var(--accent-gold))] bg-clip-text text-transparent">
              Ingat Waktu
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg text-[hsl(var(--bone-muted))] md:text-xl max-w-2xl mx-auto text-balance"
          >
            Aplikasi jadwal dan manajemen waktu harian dengan desain premium gelap.
            Atur prioritas, blok waktu, dan lihat progresmu dalam satu tempat yang tenang.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              className="group inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-8 text-base font-semibold text-white shadow-[0_8px_30px_hsl(var(--primary)/0.4)] transition-all hover:bg-[hsl(var(--primary-dark))] hover:shadow-[0_12px_40px_hsl(var(--primary)/0.5)] hover:-translate-y-0.5"
            >
              Mulai Gratis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/60 px-8 text-base font-medium text-[hsl(var(--bone))] backdrop-blur transition-all hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--bg-hover))]"
            >
              Masuk
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[hsl(var(--bone-subtle))]"
          >
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tanpa batas waktu
            </span>
            <span className="hidden sm:block">•</span>
            <span>Data lokal yang aman</span>
            <span className="hidden sm:block">•</span>
            <span>Desain gelap premium</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}