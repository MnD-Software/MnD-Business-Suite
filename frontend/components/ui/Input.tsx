"use client";

import { cn } from "@/lib/cn";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "focus-ring w-full rounded-xl border border-border bg-surface-2/70 px-4 py-2.5 text-sm text-fg outline-none placeholder:text-fg-subtle transition-all focus:border-primary focus:ring-2 focus:ring-primary/25",
        props.className
      )}
    />
  );
}
