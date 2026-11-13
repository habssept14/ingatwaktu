"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, LayoutDashboard, Calendar, ListTodo, BarChart3, Settings, LogOut, Target } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Kalender", icon: Calendar },
  { href: "/tasks", label: "Tugas", icon: ListTodo },
  { href: "/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/habits", label: "Kebiasaan", icon: Target },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col border-r border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))]/60 backdrop-blur-xl lg:flex">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-[hsl(var(--border))] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-light))] shadow-[0_4px_14px_hsl(var(--primary)/0.4)]">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <span className="font-heading text-lg font-bold text-[hsl(var(--bone))]">IngatWaktu</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-3 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--bone))]"
                  : "text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))]"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[hsl(var(--primary))]"
                />
              )}
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 transition-colors",
                  isActive ? "text-[hsl(var(--primary))]" : ""
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-[hsl(var(--border))] p-3">
        <div className="flex items-center gap-3 rounded-xl p-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: user.avatarColor }}
          >
            {getInitials(user.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-[hsl(var(--bone))]">{user.name}</p>
            <p className="truncate text-xs text-[hsl(var(--bone-subtle))]">{user.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg p-2 text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-colors"
            aria-label="Keluar"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}