"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { mainNav, siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-brand-900 text-brand-100 lg:block">
        <div className="container-wide flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent-400" />
              {siteConfig.hours[0].day}: {siteConfig.hours[0].time}
            </span>
            <span className="text-brand-300">
              Serving {siteConfig.contact.address.line2}
            </span>
          </div>
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex items-center gap-1.5 font-semibold text-white transition hover:text-accent-300"
          >
            <Phone className="h-3.5 w-3.5 text-accent-400" />
            {siteConfig.contact.phone}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-slate-200 bg-white/90 shadow-soft backdrop-blur-md"
            : "border-transparent bg-white lg:bg-white/70 lg:backdrop-blur",
        )}
      >
        <div className="container-wide flex h-16 items-center justify-between lg:h-20">
          <Logo />

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Primary"
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-brand-50 text-brand-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-900",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href="/book" size="sm">
              Book Inspection
            </Button>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-brand-900 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top bg-white transition-all duration-300 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
        style={{ height: "calc(100dvh - 4rem)" }}
      >
        <nav
          className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-4"
          aria-label="Mobile"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b border-slate-100 py-4 text-lg font-medium",
                isActive(item.href) ? "text-accent-600" : "text-brand-900",
              )}
            >
              {item.title}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/book" size="lg">
              Book Inspection
            </Button>
            <Button href={siteConfig.contact.phoneHref} variant="outline" size="lg">
              <Phone className="h-4 w-4" /> {siteConfig.contact.phone}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
