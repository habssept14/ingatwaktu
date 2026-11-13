import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  const absDiff = Math.abs(diff);
  const minutes = Math.floor(absDiff / 60000);
  const hours = Math.floor(absDiff / 3600000);
  const days = Math.floor(absDiff / 86400000);

  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit ${diff > 0 ? "lagi" : "yang lalu"}`;
  if (hours < 24) return `${hours} jam ${diff > 0 ? "lagi" : "yang lalu"}`;
  if (days < 7) return `${days} hari ${diff > 0 ? "lagi" : "yang lalu"}`;
  return formatDate(d, { weekday: "short", month: "short", day: "numeric" });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "hsl(var(--destructive))";
    case "MEDIUM":
      return "hsl(var(--warning))";
    case "LOW":
      return "hsl(var(--success))";
    default:
      return "hsl(var(--bone-muted))";
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "Tinggi";
    case "MEDIUM":
      return "Sedang";
    case "LOW":
      return "Rendah";
    default:
      return priority;
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "TODO":
      return "Belum Mulai";
    case "IN_PROGRESS":
      return "Sedang Berjalan";
    case "DONE":
      return "Selesai";
    case "SKIPPED":
      return "Dilewati";
    default:
      return status;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "TODO":
      return "hsl(var(--bone-muted))";
    case "IN_PROGRESS":
      return "hsl(var(--primary))";
    case "DONE":
      return "hsl(var(--success))";
    case "SKIPPED":
      return "hsl(var(--destructive))";
    default:
      return "hsl(var(--bone-muted))";
  }
}

export function minutesToHours(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;
  const sorted = dates.map((d) => new Date(d).toDateString()).sort().reverse();
  let streak = 1;
  let current = new Date(sorted[0]);
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i]);
    const diff = Math.floor((current.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      streak++;
      current = prev;
    } else if (diff > 1) {
      break;
    }
  }
  return streak;
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function isOverdue(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}