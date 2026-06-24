import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/forms/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}. Call, email or send us a message — we're happy to help with any questions.`,
};

const cards = [
  {
    icon: Phone,
    title: "Call us",
    value: siteConfig.contact.phone,
    href: siteConfig.contact.phoneHref,
  },
  {
    icon: Mail,
    title: "Email us",
    value: siteConfig.contact.email,
    href: siteConfig.contact.emailHref,
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
    href: `https://maps.google.com/?q=${encodeURIComponent(
      siteConfig.contact.address.mapsQuery,
    )}`,
  },
];

export default function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    siteConfig.contact.address.mapsQuery,
  )}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        title="Get in touch"
        description="Have a question or ready to schedule? We'd love to hear from you. Reach out any way you prefer."
      />

      <Section>
        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <a
                href={card.href}
                target={card.icon === MapPin ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex h-full flex-col items-start gap-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-50 text-accent-600 transition group-hover:bg-accent-500 group-hover:text-white">
                  <card.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  {card.title}
                </span>
                <span className="font-semibold text-brand-900">
                  {card.value}
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <div className="surface-card p-7 sm:p-9">
              <h2 className="text-2xl font-bold text-brand-900">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                We typically respond within a few business hours.
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </Reveal>

          {/* Map + hours */}
          <Reveal direction="left" className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-soft">
              <iframe
                title={`Map showing ${siteConfig.name} location`}
                src={mapSrc}
                width="100%"
                height="320"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block w-full"
              />
            </div>
            <div className="mt-6 surface-card p-7">
              <h3 className="flex items-center gap-2 text-lg font-bold text-brand-900">
                <Clock className="h-5 w-5 text-accent-500" />
                Business hours
              </h3>
              <ul className="mt-4 space-y-2.5">
                {siteConfig.hours.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between border-b border-slate-50 pb-2.5 text-sm last:border-0"
                  >
                    <span className="text-slate-500">{h.day}</span>
                    <span className="font-semibold text-brand-900">
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
