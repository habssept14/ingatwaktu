"use client";

import { useState } from "react";
import { Clock, Search, Bell, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";

const pageLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/calendar": "Kalender",
  "/tasks": "Tugas",
  "/analytics": "Analitik",
  "/habits": "Kebiasaan",
  "/settings": "Pengaturan",
};

export function TopBar({ user }: { user: any }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageLabel = (() => {
    const match = Object.keys(pageLabels).find((key) => pathname === key || (key !== "/dashboard" && pathname.startsWith(key)));
    return match ? pageLabels[match] : "IngatWaktu";
  })();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--bg-deep))]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-elevated))] hover:text-[hsl(var(--bone))] lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-heading text-lg font-semibold text-[hsl(var(--bone))] md:text-xl">
              {pageLabel}
            </h1>
            <p className="hidden text-xs text-[hsl(var(--bone-subtle))] md:block">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/tasks?new=1"
            className="hidden h-10 items-center gap-2 rounded-xl bg-[hsl(var(--primary))] px-4 text-sm font-semibold text-white shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:bg-[hsl(var(--primary-dark))] transition-colors sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Tugas Baru
          </Link>

          <button className="rounded-xl p-2 text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-elevated))] hover:text-[hsl(var(--bone))] transition-colors" aria-label="Notifikasi">
            <Bell className="h-5 w-5" />
          </button>

          <div className="hidden h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white md:flex" style={{ backgroundColor: user.avatarColor }}>
            {getInitials(user.name)}
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} user={user} />
    </>
  );
}