import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "./Reveal";
import type { ReactNode } from "react";

type Crumb = { label: string; href?: string };

export function PageHeader({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: string;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] opacity-30" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />

      <div className="container-wide relative py-16 lg:py-24">
        <Reveal className="max-w-3xl">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="mb-5">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-brand-200">
                {breadcrumbs.map((crumb, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="transition hover:text-accent-300"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-white">{crumb.label}</span>
                    )}
                    {i < breadcrumbs.length - 1 && (
                      <ChevronRight className="h-3.5 w-3.5 text-brand-400" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <h1 className="text-4xl font-extrabold text-white sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 text-lg leading-relaxed text-brand-100">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </Reveal>
      </div>
    </section>
  );
}
