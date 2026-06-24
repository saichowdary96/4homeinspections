import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSection({ limit }: { limit?: number }) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;

  return (
    <Section>
      <SectionHeading
        eyebrow="Client Reviews"
        title="Homeowners & agents love working with us"
        description="Don't just take our word for it — here's what our clients say about their inspection experience."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.name} delay={(i % 3) * 0.1}>
            <TestimonialCard item={item} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
