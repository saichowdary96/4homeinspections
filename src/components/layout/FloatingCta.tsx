"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarCheck, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mobile-friendly floating action: a persistent "Book" button plus a
 * back-to-top control that appears after the user scrolls.
 */
export function FloatingCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "pointer-events-auto grid h-11 w-11 place-items-center rounded-full bg-brand-900 text-white shadow-card transition-all duration-300 hover:bg-brand-800",
          show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <Link
        href="/book"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-accent-600 lg:hidden"
      >
        <CalendarCheck className="h-4 w-4" />
        Book Now
      </Link>
    </div>
  );
}
