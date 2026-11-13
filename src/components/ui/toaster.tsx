"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => (
  <Sonner
    theme="dark"
    className={cn("toaster group", props.className)}
    toastOptions={{
      classNames: {
        toast: "group toast group-[.toast]:bg-[hsl(var(--bg-elevated))] group-[.toast]:border-[hsl(var(--border))] group-[.toast]:text-[hsl(var(--bone))]",
        description: "group-[.toast]:text-[hsl(var(--bone-muted))]",
        actionButton: "group-[.toast]:bg-[hsl(var(--primary))] group-[.toast]:text-[hsl(var(--primary-foreground))]",
        cancelButton: "group-[.toast]:bg-[hsl(var(--bg-hover))] group-[.toast]:text-[hsl(var(--bone))]",
        closeButton: "group-[.toast]:text-[hsl(var(--bone-subtle))]",
      },
      ...props.toastOptions,
    }}
  />
);

export { Toaster };