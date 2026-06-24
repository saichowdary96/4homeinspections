import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/services";

export function ServicesPreview() {
  return (
    <Section className="bg-slate-50">
      <SectionHeading
        eyebrow="Our Services"
        title="Inspections for every stage of homeownership"
        description="Whether you're buying, selling, building or simply maintaining your home, we have an inspection tailored to your needs."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <Reveal key={service.slug} delay={(i % 3) * 0.1}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button href="/services" variant="outline" size="lg">
          View All Services
        </Button>
      </div>
    </Section>
  );
}
