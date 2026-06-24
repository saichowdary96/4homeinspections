import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { CtaSection } from "@/components/sections/CtaSection";
import { testimonials } from "@/data/testimonials";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Reviews & Testimonials",
  description: `Read why homeowners, sellers and real estate agents trust ${siteConfig.name} — rated 4.9/5 across hundreds of reviews.`,
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reviews" }]}
        title="What our clients say"
        description="We're honored to have earned the trust of thousands of homeowners and real estate professionals. Here's what they have to say."
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 backdrop-blur">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-accent-400 text-accent-400" />
            ))}
          </span>
          <span className="text-sm font-semibold text-white">
            4.9 / 5 average from 850+ reviews
          </span>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={(i % 3) * 0.08}>
              <TestimonialCard item={item} />
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection title="Join hundreds of happy homeowners" />
    </>
  );
}
