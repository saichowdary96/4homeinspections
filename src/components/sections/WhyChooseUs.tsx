import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { benefits } from "@/data/process";

export function WhyChooseUs() {
  return (
    <Section className="bg-slate-50">
      <SectionHeading
        eyebrow="Why Choose Us"
        title="The most trusted inspection team in the region"
        description="We combine deep expertise, modern technology and genuine care to give you the clearest possible picture of your home."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map((benefit, i) => (
          <Reveal key={benefit.title} delay={(i % 3) * 0.1}>
            <div className="group flex h-full gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent-50 text-accent-600 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
                <Icon name={benefit.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-brand-900">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {benefit.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
