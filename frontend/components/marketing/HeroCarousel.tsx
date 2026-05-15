"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Slide = {
  src: string;
  title: string;
  caption: string;
};

const slides: Slide[] = [
  {
    src: "/hero/system-login.png",
    title: "Welcome Experience",
    caption: "A clean, focused entry point designed for clarity and confidence.",
  },
  {
    src: "/hero/system-dashboard.png",
    title: "Unified Workspace",
    caption: "Everything important in one place, presented in a calm visual layout.",
  },
  {
    src: "/hero/system-app-launcher.png",
    title: "Quick Navigation",
    caption: "Move between tools and actions quickly through a single launcher view.",
  },
];

export function HeroCarousel({ className = "" }: { className?: string }) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const active = slides[index];
  const hasImage = !failed[index];

  return (
    <div className={`relative overflow-hidden rounded-[2rem] border border-black/10 bg-black shadow-[0_35px_90px_-35px_rgba(0,0,0,0.45)] ${className}`}>
      <div className="relative aspect-[16/9] w-full md:aspect-[16/7]">
          {hasImage ? (
            <img
              key={active.src}
              src={active.src}
              alt={active.title}
              className="h-full w-full object-cover"
              onError={() => setFailed((prev) => ({ ...prev, [index]: true }))}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(80,140,255,0.2),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(0,180,255,0.18),transparent_45%),#03050a]">
              <p className="px-6 text-center text-sm text-white/70">
                Add screenshot image: <span className="font-semibold text-white">{active.src}</span>
              </p>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/25" />
          <div className="absolute bottom-14 left-4 right-4 sm:left-7 sm:right-7 md:bottom-16">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/75 sm:text-xs">Featured Experience</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-medium leading-tight text-white sm:text-4xl md:text-6xl">
              {active.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">{active.caption}</p>
            <Link
              href="/subscription/plans"
              className="mt-4 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black"
            >
              Shop Product
            </Link>
          </div>
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-10 bg-white" : "w-6 bg-white/45"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
    </div>
  );
}
