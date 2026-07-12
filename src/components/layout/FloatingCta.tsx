"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUp, Phone, MessageCircle } from "lucide-react";
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

    {/* WhatsApp Button */}
    <a
      href="https://wa.me/918121660345?text=Hi%2C%20I'm%20interested%20in%20a%20Home%20Inspection."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-green-500 text-white shadow-lg transition hover:scale-110 hover:bg-green-600"
    >
      <MessageCircle className="h-6 w-6" />
    </a>

    {/* Call Button */}
    <a
      href="tel:+918121660345"
      aria-label="Call Now"
      className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full bg-blue-600 text-white shadow-lg transition hover:scale-110 hover:bg-blue-700"
    >
      <Phone className="h-6 w-6" />
    </a>

    {/* Back To Top */}
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

  </div>
);
}
