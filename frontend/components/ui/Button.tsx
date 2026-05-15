"use client";

import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 ease-ease-out",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-11 px-5 text-base",
        variant === "primary" &&
          "bg-gradient-to-r from-primary to-primary-strong text-white shadow-sm hover:opacity-95",
        variant === "secondary" &&
          "bg-surface-2 text-fg border border-border shadow-sm hover:bg-surface-3 hover:shadow",
        variant === "ghost" &&
          "bg-surface/80 text-fg border border-border/80 hover:bg-surface-2",
        variant === "destructive" &&
          "bg-error text-white shadow-sm hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}
