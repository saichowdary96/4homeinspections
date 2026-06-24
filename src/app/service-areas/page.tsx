import type { Metadata } from "next";
import { MapPin, Navigation } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CtaSection } from "@/components/sections/CtaSection";
import { serviceRegions, allCities } from "@/data/serviceAreas";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Service Areas",
  description: `${siteConfig.name} proudly serves ${allCities.length}+ communities across the region. See if we cover your area.`,
};

export default function ServiceAreasPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Service Areas" }]}
        title="Proudly serving your community"
        description={`We provide professional home inspections across ${allCities.length}+ communities. Don't see your town? Reach out — we likely cover it too.`}
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {serviceRegions.map((region, i) => (
            <Reveal key={region.region} delay={(i % 2) * 0.1}>
              <div className="h-full rounded-2xl border border-slate-100 bg-white p-7 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-50 text-accent-600">
                    <Navigation className="h-5 w-5" />
                  </span>
                  <h2 className="text-xl font-bold text-brand-900">
                    {region.region}
                  </h2>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  {region.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {region.cities.map((city) => (
                    <li
                      key={city}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-sm font-medium text-brand-800"
                    >
                      <MapPin className="h-3.5 w-3.5 text-accent-500" />
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h3 className="text-lg font-bold text-brand-900">
            Don&rsquo;t see your area listed?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
            Our coverage is always expanding. Give us a call or send a message —
            chances are we can help.
          </p>
          <Button href="/contact" className="mt-5">
            Check Your Area
          </Button>
        </Reveal>
      </Section>

      <CtaSection />
    </>
  );
}
