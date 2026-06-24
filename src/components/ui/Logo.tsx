import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";

/**
 * Inline SVG mark (a house + shield/checkmark) so the brand needs no external
 * image asset. Swap the <svg> for an <Image> of your own logo when ready.
 */
export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — home`}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 shadow-soft transition-transform duration-200 group-hover:scale-105">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 11.2 12 4l9 7.2"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10v9h14v-9"
            stroke="#ffbf4a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m9.2 13.6 1.9 1.9 3.7-3.8"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-extrabold tracking-tight",
            light ? "text-white" : "text-brand-900",
          )}
        >
          {siteConfig.name.split(" ")[0]}
          {siteConfig.name.split(" ").length > 1 ? (
            <span className="text-accent-500">
              {" "}
              {siteConfig.name.split(" ").slice(1).join(" ")}
            </span>
          ) : null}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.18em]",
            light ? "text-brand-200" : "text-slate-400",
          )}
        >
          {siteConfig.tagline}
        </span>
      </span>
    </Link>
  );
}
