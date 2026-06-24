import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { CtaSection } from "@/components/sections/CtaSection";
import { faqs, type Faq } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about home inspections — the process, pricing, reports and what to expect.",
};

const categories: Faq["category"][] = [
  "General",
  "Process",
  "Pricing",
  "Reports",
];

/** FAQ structured data for rich results in search. */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        title="Frequently asked questions"
        description="Everything you need to know about home inspections. Still have questions? We're always happy to help."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-12">
          {categories.map((category) => {
            const items = faqs.filter((f) => f.category === category);
            if (items.length === 0) return null;
            return (
              <Reveal key={category}>
                <h2 className="mb-5 text-2xl font-bold text-brand-900">
                  {category}
                </h2>
                <Accordion items={items} defaultOpen={null} />
              </Reveal>
            );
          })}
        </div>
      </Section>

      <CtaSection title="Still have questions?" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
