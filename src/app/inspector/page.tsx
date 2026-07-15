import type { Metadata } from "next";
import { GraduationCap, Briefcase, Award } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CtaSection } from "@/components/sections/CtaSection";

export const metadata: Metadata = {
  title: "About 4 Home Inspections",
 description:
  "Learn about 4 Home Inspections, our services, inspection process and commitment to delivering professional property inspection reports.",
};

const inspector = {
  name: "4 Home Inspections",
  title: "Professional Home & Building Inspection Services",
  initials: "4H",
  bio: [
    "4 Home Inspections provides professional home, apartment, villa and commercial property inspection services across Hyderabad, Vijayawada and Visakhapatnam.",
    "Our mission is to help home buyers, property owners and investors make informed decisions through detailed inspections and easy-to-understand digital reports.",
    "Every inspection is carried out with modern tools, attention to detail and complete transparency, giving our clients confidence before they buy or take possession of their property.",
  ],
  highlights: [
    { icon: GraduationCap, label: "Professional Home Inspection" },
    { icon: Award, label: "Detailed Digital Reports" },
  ],
};

export default function InspectorPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Inspector" }]}
       title="About 4 Home Inspections"
        description="Professional home and building inspection services helping buyers and owners make informed property decisions."
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
                  Book an Inspection
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Bio */}
          <div className="lg:col-span-8">
            <Reveal>
              <span className="eyebrow mb-4">Biography</span>
              <h2 className="text-3xl sm:text-4xl">
               Professional Home Inspection Services You Can Trust
              </h2>
              <div className="mt-6 space-y-4 text-slate-600">
                {inspector.bio.map((p, i) => (
                  <p key={i}>{p}</p>
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
