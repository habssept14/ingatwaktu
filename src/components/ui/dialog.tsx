"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";

// Local wrappers — Radix doesn't export DialogHeader/Footer, so we wrap the
// raw elements with our classNames for consistent styling.
function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />;
}
function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-row justify-end gap-3", className)} {...props} />;
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  variant = "default",
  loading,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-[hsl(var(--bone-muted))]">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3">
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))] transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={async () => {
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
              variant === "destructive"
                ? "bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(0_84%_55%)]"
                : "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-dark))]"
            )}
          >
            {loading ? "Memproses..." : confirmText}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
}

export function AlertDialog({ open, onOpenChange, title, description, onConfirm, loading }: AlertDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex items-start justify-between">
          <div>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-sm text-[hsl(var(--bone-muted))] mt-1">{description}</DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-lg text-[hsl(var(--bone-subtle))] hover:bg-[hsl(var(--bg-hover))] hover:text-[hsl(var(--bone))] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <DialogFooter className="gap-3 mt-6">
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-elevated))] px-4 py-2.5 text-sm font-medium text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))] transition-all"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
            className="flex-1 rounded-xl bg-[hsl(var(--destructive))] px-4 py-2.5 text-sm font-medium text-white hover:bg-[hsl(0_84%_55%)] transition-all disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Hapus"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}