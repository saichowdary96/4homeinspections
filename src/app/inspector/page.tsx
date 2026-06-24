import type { Metadata } from "next";
import { BadgeCheck, GraduationCap, Briefcase, Award } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CtaSection } from "@/components/sections/CtaSection";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Meet Your Inspector",
  description:
    "Get to know your certified, experienced home inspector — credentials, experience, and a genuine commitment to your peace of mind.",
};

const inspector = {
  name: "Michael Reed",
  title: "Lead Inspector & Founder",
  initials: "MR",
  bio: [
    "Michael founded the company after more than a decade in residential construction, where he saw firsthand how often costly defects went unnoticed. Determined to give buyers an honest advocate, he became a certified inspector and never looked back.",
    "He has personally inspected thousands of homes and holds advanced certifications in radon measurement and infrared thermography. Clients consistently praise his patience, clarity, and genuine care.",
    "When he's not on a roof or in a crawlspace, Michael enjoys mentoring new inspectors and volunteering with local first-time homebuyer programs.",
  ],
  highlights: [
    { icon: Briefcase, label: "12+ years inspecting" },
    { icon: GraduationCap, label: "Construction background" },
    { icon: Award, label: "5,000+ five-star reviews" },
    { icon: BadgeCheck, label: "Fully licensed & insured" },
  ],
};

export default function InspectorPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Inspector" }]}
        title="Meet your inspector"
        description="Experience, certifications and a genuine commitment to your peace of mind — the person behind every thorough report."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Profile card */}
          <Reveal className="lg:col-span-4">
            <div className="surface-card overflow-hidden">
              <div className="flex flex-col items-center bg-gradient-to-br from-brand-800 to-brand-950 px-8 py-10 text-center">
                <span className="grid h-28 w-28 place-items-center rounded-full bg-white/10 font-display text-3xl font-bold text-white ring-4 ring-white/10">
                  {inspector.initials}
                </span>
                <h2 className="mt-5 text-2xl font-bold text-white">
                  {inspector.name}
                </h2>
                <p className="mt-1 text-sm font-medium text-accent-300">
                  {inspector.title}
                </p>
              </div>
              <ul className="divide-y divide-slate-100">
                {inspector.highlights.map((h) => (
                  <li
                    key={h.label}
                    className="flex items-center gap-3 px-6 py-4 text-sm font-medium text-brand-900"
                  >
                    <h.icon className="h-5 w-5 text-accent-500" />
                    {h.label}
                  </li>
                ))}
              </ul>
              <div className="p-6">
                <Button href="/book" className="w-full">
                  Book With {inspector.name.split(" ")[0]}
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <div className="lg:col-span-8">
            <Reveal>
              <span className="eyebrow mb-4">Biography</span>
              <h2 className="text-3xl sm:text-4xl">
                A trusted advocate in your corner
              </h2>
              <div className="mt-6 space-y-4 text-slate-600">
                {inspector.bio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="text-xl font-bold text-brand-900">
                Certifications &amp; Affiliations
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {siteConfig.certifications.map((cert) => (
                  <div
                    key={cert}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-5 py-4 shadow-soft"
                  >
                    <BadgeCheck className="h-5 w-5 shrink-0 text-sage-600" />
                    <span className="text-sm font-medium text-brand-900">
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <CtaSection title="Ready to work with a true professional?" />
    </>
  );
}
