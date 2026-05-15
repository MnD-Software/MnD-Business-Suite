"use client";

import { useRouter } from "next/navigation";
import { LogOut, Moon, PanelLeftOpen, Search, Sun } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "@/lib/theme";
import { useMe } from "@/lib/me";
import { Logo } from "@/components/ui/Logo";

const AppLauncher = dynamic(
  () => import("@/components/layout/AppLauncher").then((m) => m.AppLauncher),
  { ssr: false }
);
const CommandPaletteModal = dynamic(
  () => import("@/components/command-center").then((m) => m.CommandPaletteModal),
  { ssr: false }
);
const SmartAlerts = dynamic(
  () => import("@/components/command-center").then((m) => m.SmartAlerts),
  { ssr: false }
);

export function TopNav({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const meQ = useMe();
  const reduceMotion = useReducedMotion();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.18, ease: "easeOut" }}
      className="surface noise flex flex-wrap items-center justify-between gap-2 rounded-2xl px-3 py-2.5 shadow-glass sm:px-4 sm:py-3"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onOpenMenu && (
          <div className="lg:hidden">
            <IconButton onClick={onOpenMenu} aria-label="Open menu" size="sm">
              <PanelLeftOpen className="h-4 w-4" />
            </IconButton>
          </div>
        )}
        <Logo size="md" showText />
        <AppLauncher me={meQ.data ?? null} />
        <CommandPaletteModal />
      </div>
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <SmartAlerts />
        {meQ.data?.full_name && (
          <div className="hidden text-sm text-[hsl(var(--c-muted-2))] md:block">{meQ.data.full_name}</div>
        )}
        <IconButton onClick={toggle} aria-label="Toggle theme" size="sm">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </IconButton>
        <Button variant="ghost" onClick={logout} size="sm" className="px-2 sm:px-3">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </motion.div>
  );
}
