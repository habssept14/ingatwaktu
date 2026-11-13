"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, Calendar, ListTodo, BarChart3, Settings, Target, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn, getInitials } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Kalender", icon: Calendar },
  { href: "/tasks", label: "Tugas", icon: ListTodo },
  { href: "/analytics", label: "Analitik", icon: BarChart3 },
  { href: "/habits", label: "Kebiasaan", icon: Target },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

export function MobileNav({ open, onOpenChange, user }: { open: boolean; onOpenChange: (open: boolean) => void; user: any }) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-[hsl(var(--bg-deep))]/80 backdrop-blur-sm lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 transform border-r border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[hsl(var(--border))] px-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ backgroundColor: user.avatarColor }}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(var(--bone))]">{user.name}</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--bg-hover))]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--bone))]"
                    : "text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))]"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-[hsl(var(--primary))]" : "")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-3 left-3 right-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl border border-[hsl(var(--border))] px-3 py-3 text-sm font-medium text-[hsl(var(--bone-muted))] hover:bg-[hsl(var(--bg-hover))]"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}