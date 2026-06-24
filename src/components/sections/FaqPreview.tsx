import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { faqs } from "@/data/faqs";

export function FaqPreview({ limit = 5 }: { limit?: number }) {
  const items = faqs.slice(0, limit);

  return (
    <Section className="bg-slate-50">
      <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-5">
          <SectionHeading
            align="left"
            eyebrow="FAQ"
            title="Answers to your questions"
            description="Everything you need to know about the inspection process. Can't find what you're looking for?"
          />
          <Button href="/contact" variant="outline" className="mt-7">
            Ask Us Anything
          </Button>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <Accordion items={items} />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
