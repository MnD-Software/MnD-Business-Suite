"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/layout/Sidebar").then((m) => m.Sidebar), { ssr: false });
const TopNav = dynamic(() => import("@/components/layout/TopNav").then((m) => m.TopNav), { ssr: false });
const MobileNav = dynamic(() => import("@/components/layout/MobileNav").then((m) => m.MobileNav), { ssr: false });
const MobileMenuDrawer = dynamic(
  () => import("@/components/layout/MobileMenuDrawer").then((m) => m.MobileMenuDrawer),
  { ssr: false }
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  return (
    <div className="relative h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute -left-40 top-[-220px] h-[520px] w-[520px] rounded-full bg-[hsl(var(--c-accent))]/15 blur-3xl" />
        <div className="absolute -right-48 top-[-160px] h-[520px] w-[520px] rounded-full bg-[hsl(var(--c-accent-2))]/12 blur-3xl" />
      </div>

      <div className="flex h-[100dvh] w-full gap-3 px-2 py-2 sm:gap-4 sm:px-4 sm:py-4 lg:px-6">
        <div className="hidden lg:block">
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        </div>
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden">
          <TopNav onOpenMenu={() => setMobileMenuOpen(true)} />
          <motion.main
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.2, ease: "easeOut" }}
            className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(6.5rem+env(safe-area-inset-bottom))] pr-1 lg:pb-0 lg:pr-0"
          >
            {children}
          </motion.main>
        </div>
      </div>

      <MobileNav />
      <MobileMenuDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
}
