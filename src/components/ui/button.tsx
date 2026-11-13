"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  loading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading, disabled, children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--bg-deep))] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

    const variants = {
      default:
        "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary-dark))] shadow-[0_4px_14px_hsl(var(--primary)/0.3)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.4)]",
      destructive:
        "bg-[hsl(var(--destructive))] text-white hover:bg-[hsl(0_84%_55%)] shadow-[0_4px_14px_hsl(0_84%_60%/0.3)]",
      outline:
        "border-2 border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--bg-hover))] hover:border-[hsl(var(--primary))] text-[hsl(var(--bone))]",
      secondary:
        "bg-[hsl(var(--bg-elevated))] text-[hsl(var(--bone))] hover:bg-[hsl(var(--bg-hover))] border border-[hsl(var(--border))]",
      ghost:
        "bg-transparent hover:bg-[hsl(var(--bg-hover))] text-[hsl(var(--bone))]",
      link: "text-[hsl(var(--primary))] underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-11 px-5 py-2",
      sm: "h-9 px-3 rounded-lg text-xs",
      lg: "h-12 px-6 rounded-xl text-base",
      xl: "h-14 px-8 rounded-xl text-lg",
      icon: "h-11 w-11",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-1 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };