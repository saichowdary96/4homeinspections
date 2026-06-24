import type { Metadata } from "next";
import { Check, Info } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Pricing & Free Quote",
  description:
    "Transparent home inspection pricing with no hidden fees. Request a free, personalized, no-obligation quote today.",
};

/** Pricing is intentionally illustrative; final quotes are personalized. */
const addons = [
  { name: "Radon Testing", price: "$150" },
  { name: "Thermal Imaging", price: "$125" },
  { name: "Sewer Scope", price: "$185" },
  { name: "Mold Air Sampling", price: "$175" },
  { name: "Pool & Spa Inspection", price: "$95" },
  { name: "Re-Inspection Visit", price: "$125" },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
        title="Transparent, fair pricing"
        description="No hidden fees, no surprises. Pricing depends on the home's size, age and any add-ons. Request a free quote for an exact price."
      />

      <Section>
        <SectionHeading
          eyebrow="Inspection Services"
          title="Service pricing"
          description="Starting prices for our core inspections. Larger or older homes may vary — your free quote will be exact."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-soft">
                <h3 className="text-lg font-bold text-brand-900">
                  {service.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">
                  {service.summary}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-sm text-slate-400">from</span>
                  <span className="font-display text-3xl font-extrabold text-brand-900">
                    {service.priceFrom}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400">{service.duration}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-slate-50">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Add-ons */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                align="left"
                eyebrow="Add-Ons"
                title="Optional add-on services"
                description="Customize your inspection with specialized testing for extra peace of mind."
              />
              <ul className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft">
                {addons.map((addon) => (
                  <li
                    key={addon.name}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <span className="flex items-center gap-3 text-sm font-medium text-brand-900">
                      <Check className="h-4 w-4 text-sage-600" />
                      {addon.name}
                    </span>
                    <span className="font-display font-bold text-brand-900">
                      {addon.price}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                Bundle add-ons with your inspection for the best value. Prices
                shown are illustrative — your personalized quote will confirm
                exact pricing.
              </p>
            </Reveal>
          </div>

          {/* Quote form */}
          <Reveal direction="left" className="lg:col-span-7">
            <div className="surface-card p-7 sm:p-9">
              <h2 className="text-2xl font-bold text-brand-900">
                Request a free quote
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Tell us about your property and we&rsquo;ll send a personalized,
                no-obligation quote.
              </p>
              <div className="mt-7">
                <QuoteForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <FaqPreview limit={4} />
    </>
  );
}
