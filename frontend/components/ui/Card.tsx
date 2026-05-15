import { cn } from "@/lib/cn";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface/70 p-5 shadow-glass backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-2/80 hover:shadow-pop",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
