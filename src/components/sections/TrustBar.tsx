import { ShieldCheck } from "lucide-react";
import { siteConfig } from "@/data/site";

/** Scrolling marquee of certifications/affiliations to build credibility. */
export function TrustBar() {
  const items = [...siteConfig.certifications, ...siteConfig.certifications];

  return (
    <div className="border-y border-slate-100 bg-white py-6">
      <div className="container-wide">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Trusted, certified &amp; fully accredited
        </p>
        <div className="group relative overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-10 pause-on-hover">
            {items.map((cert, i) => (
              <span
                key={`${cert}-${i}`}
                className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-slate-500"
              >
                <ShieldCheck className="h-4 w-4 text-accent-500" />
                {cert}
              </span>
            ))}
          </div>
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}
