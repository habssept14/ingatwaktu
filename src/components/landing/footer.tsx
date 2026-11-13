"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/40 py-10 backdrop-blur">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-light))]">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-base font-bold text-[hsl(var(--bone))]">
              IngatWaktu
            </span>
          </div>
          <p className="text-sm text-[hsl(var(--bone-subtle))]">
            © 2026 IngatWaktu. <span className="text-[hsl(var(--bone-muted))]">Ingat Aku, Ingat Waktu.</span>
          </p>
          <div className="flex gap-4 text-sm text-[hsl(var(--bone-muted))]">
            <Link href="/login" className="hover:text-[hsl(var(--bone))] transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="hover:text-[hsl(var(--bone))] transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}