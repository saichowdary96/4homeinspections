import type { Metadata } from "next";
import { Target, Heart, ShieldCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { StatsSection } from "@/components/sections/StatsSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} — our mission, our values, and our commitment to thorough, honest home inspections.`,
};

const values = [
  {
    icon: ShieldCheck,
    title: "Integrity First",
    description:
      "We report exactly what we find — no sugar-coating, no scare tactics. Just honest, objective facts you can trust.",
  },
  {
    icon: Target,
    title: "Uncompromising Thoroughness",
    description:
      "We never cut corners. Every accessible system gets the careful attention it deserves, every single time.",
  },
  {
    icon: Heart,
    title: "Genuine Care",
    description:
      "Behind every inspection is a family making a major decision. We treat your home like it's our own.",
  },
  {
    icon: Users,
    title: "Education & Empowerment",
    description:
      "We don't just hand you a report — we teach you about your home so you can make confident decisions.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="Built on trust, driven by detail"
        description={`${siteConfig.name} was founded on a simple belief: every homeowner deserves clear, honest answers about the biggest investment of their life.`}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="eyebrow mb-4">Our Story</span>
            <h2 className="text-3xl sm:text-4xl">
              A decade of protecting homeowners
            </h2>
            <div className="mt-6 space-y-4 text-slate-600">
              <p>
                What started as one inspector with a flashlight and a passion
                for doing things right has grown into the region&rsquo;s most
                trusted inspection team. Over {siteConfig.stats[0].value} years,
                we&rsquo;ve walked thousands of buyers, sellers and homeowners
                through their properties with patience and precision.
              </p>
              <p>
                We&rsquo;ve seen it all — from minor cosmetic quirks to hidden
                structural surprises — and we bring that hard-won experience to
                every inspection. Our reports are clear, our communication is
                honest, and our standards never slip.
              </p>
              <p>
                Today we combine that experience with modern technology like
                thermal imaging and moisture detection to deliver the most
                thorough inspections available. But our mission remains the
                same: give you the truth, so you can decide with confidence.
              </p>
            </div>
            <Button href="/book" className="mt-8">
              Work With Us
            </Button>
          </Reveal>

          <Reveal direction="left">
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-8 shadow-card">
                <div className="flex h-full flex-col justify-between text-white">
                  <ShieldCheck className="h-12 w-12 text-accent-400" />
                  <div>
                    <p className="font-display text-2xl font-bold">
                      &ldquo;Our job is to give you the full picture — the good,
                      the bad, and everything in between.&rdquo;
                    </p>
                    <p className="mt-4 text-sm text-brand-200">
                      — The {siteConfig.name} Team
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-accent-500 px-6 py-5 text-white shadow-glow sm:block">
                <p className="font-display text-3xl font-extrabold">
                  {siteConfig.stats[1].value}
                </p>
                <p className="text-sm">Homes inspected</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <StatsSection />

      <Section className="bg-slate-50">
        <SectionHeading
          eyebrow="Our Values"
          title="The principles behind every inspection"
          description="These aren't just words on a wall — they guide how we show up for every client, every day."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={(i % 2) * 0.1}>
              <div className="flex h-full gap-5 rounded-2xl border border-slate-100 bg-white p-7 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <value.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-brand-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/inspector" variant="outline" size="lg">
            Meet Your Inspector
          </Button>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
