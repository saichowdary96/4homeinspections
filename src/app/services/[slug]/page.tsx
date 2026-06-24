import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Clock, Users, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { CtaSection } from "@/components/sections/CtaSection";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { getServiceBySlug, services } from "@/data/services";

type Params = { slug: string };

/** Pre-render a static page for every service. Required for `output: export`. */
export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
  };
}

export default function ServiceDetailPage({ params }: { params: Params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.title },
        ]}
        title={service.title}
        description={service.summary}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/book" variant="primary">
            Book This Inspection
          </Button>
          <Button href="/pricing" variant="white">
            Get a Quote
          </Button>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Main content */}
          <div className="lg:col-span-7">
            <Reveal>
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-50 text-accent-600">
                <Icon name={service.icon} className="h-8 w-8" />
              </span>
              <h2 className="mt-6 text-2xl font-bold sm:text-3xl">
                What&rsquo;s this inspection about?
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                {service.intro}
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="text-xl font-bold text-brand-900">
                What we inspect &amp; include
              </h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-brand-900 shadow-soft"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage-100 text-sage-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <Reveal direction="left" className="lg:sticky lg:top-28">
              <div className="surface-card p-7">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-slate-500">Starting at</span>
                  <span className="font-display text-3xl font-extrabold text-brand-900">
                    {service.priceFrom}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Final price depends on size, age &amp; add-ons.
                </p>

                <dl className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-accent-500" />
                    <dt className="text-slate-500">Typical duration:</dt>
                    <dd className="font-semibold text-brand-900">
                      {service.duration}
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                    <div>
                      <dt className="text-slate-500">Best for:</dt>
                      <dd className="font-semibold text-brand-900">
                        {service.bestFor}
                      </dd>
                    </div>
                  </div>
                </dl>

                <div className="mt-7 space-y-3">
                  <Button href="/book" className="w-full" size="lg">
                    Book Now
                  </Button>
                  <Button
                    href="/pricing"
                    variant="outline"
                    className="w-full"
                  >
                    Request a Quote
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Other services */}
      <Section className="bg-slate-50">
        <h2 className="text-2xl font-bold text-brand-900">
          Explore other services
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="font-semibold text-brand-900">{s.title}</span>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-accent-500 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Section>

      <FaqPreview limit={4} />
      <CtaSection />
    </>
  );
}
