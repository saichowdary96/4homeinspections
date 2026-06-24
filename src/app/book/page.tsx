import type { Metadata } from "next";
import { Phone, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BookingForm } from "@/components/forms/BookingForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Book an Inspection",
  description:
    "Request your home inspection online in minutes. Pick your service and preferred date — we'll confirm fast.",
};

const reassurances = [
  "No-obligation request — we'll confirm before anything is final",
  "Same-day appointments often available",
  "Detailed digital report within 24 hours",
  "Friendly walkthrough included with every inspection",
];

export default function BookPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Book" }]}
        title="Book your inspection"
        description="Fill out the quick form below and our team will confirm your appointment within a few business hours."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <div className="surface-card p-7 sm:p-9">
              <h2 className="text-2xl font-bold text-brand-900">
                Request your inspection
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Fields marked with{" "}
                <span className="text-accent-600">*</span> are required.
              </p>
              <div className="mt-7">
                <BookingForm />
              </div>
            </div>
          </Reveal>

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <Reveal direction="left" className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-2xl bg-brand-900 p-7 text-white">
                <ShieldCheck className="h-9 w-9 text-accent-400" />
                <h3 className="mt-4 text-xl font-bold">
                  What to expect
                </h3>
                <ul className="mt-5 space-y-3">
                  {reassurances.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-brand-100">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="surface-card p-7">
                <h3 className="text-lg font-bold text-brand-900">
                  Prefer to talk?
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Call us and we&rsquo;ll get you scheduled right away.
                </p>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-brand-900 transition hover:text-accent-600"
                >
                  <Phone className="h-5 w-5 text-accent-500" />
                  {siteConfig.contact.phone}
                </a>
                <div className="mt-5 space-y-1.5 border-t border-slate-100 pt-5">
                  {siteConfig.hours.map((h) => (
                    <div
                      key={h.day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="inline-flex items-center gap-2 text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {h.day}
                      </span>
                      <span className="font-medium text-brand-900">
                        {h.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>
    </>
  );
}
