import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { processSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="How It Works"
        title="A simple, stress-free process"
        description="From booking to confident decisions in four easy steps. We handle the details so you don't have to."
      />

      <div className="relative mt-16">
        {/* Connector line (desktop) */}
        <div
          className="absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block"
          aria-hidden="true"
        />
        <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, i) => (
            <Reveal as="li" key={step.step} delay={i * 0.1} className="relative">
              <div className="flex flex-col items-center text-center">
                <span className="relative z-10 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-2xl bg-white shadow-card ring-1 ring-slate-100">
                  <Icon name={step.icon} className="h-8 w-8 text-brand-700" />
                  <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-accent-500 font-display text-xs font-bold text-white">
                    {step.step}
                  </span>
                </span>
                <h3 className="mt-6 text-lg font-bold text-brand-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
