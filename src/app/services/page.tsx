import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Comprehensive home inspection services: buyer's, seller's/pre-listing, new construction, annual maintenance, radon testing and thermal imaging.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        title="Inspection services tailored to you"
        description="Whatever stage of homeownership you're in, we have a thorough, professional inspection to match. Explore our offerings below."
      >
        <Button href="/pricing" variant="white">
          Request a Free Quote
        </Button>
      </PageHeader>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={(i % 3) * 0.1}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <ProcessSection />
      <CtaSection />
    </>
  );
}
