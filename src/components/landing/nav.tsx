"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

export function LandingNav() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(var(--border))]/50 bg-[hsl(var(--bg-deep))]/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-light))] shadow-[0_4px_14px_hsl(var(--primary)/0.4)] group-hover:shadow-[0_6px_20px_hsl(var(--primary)/0.5)] transition-shadow">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-transparent opacity-40 blur-md -z-10" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-[hsl(var(--bone))]">
            IngatWaktu
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-[hsl(var(--bone-muted))] hover:text-[hsl(var(--bone))] transition-colors">
            Fitur
          </Link>
          <Link href="#preview" className="text-sm text-[hsl(var(--bone-muted))] hover:text-[hsl(var(--bone))] transition-colors">
            Preview
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-elevated))] transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-dark))] transition-colors shadow-[0_4px_14px_hsl(var(--primary)/0.3)]"
          >
            Daftar Gratis
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}