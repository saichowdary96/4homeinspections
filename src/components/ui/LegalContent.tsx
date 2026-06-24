import type { ReactNode } from "react";

/** Shared styling wrapper for long-form legal/policy text. */
export function LegalContent({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl space-y-8 text-slate-600 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-900 [&_h2]:mb-2 [&_p]:mt-2 [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
      {children}
    </div>
  );
}
