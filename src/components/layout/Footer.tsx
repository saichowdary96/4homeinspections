import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import {
  footerLegalNav,
  mainNav,
  siteConfig,
} from "@/data/site";
import { services } from "@/data/services";

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  twitter: Twitter,
} as const;

export function Footer() {
  const year = new Date().getFullYear();
  const socials = Object.entries(siteConfig.social).filter(
    ([, url]) => url,
  ) as [keyof typeof socialIcons, string][];

  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container-wide py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-brand-200">
              {siteConfig.description}
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={siteConfig.contact.phoneHref}
                  className="inline-flex items-center gap-3 transition hover:text-accent-300"
                >
                  <Phone className="h-4 w-4 text-accent-400" />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.emailHref}
                  className="inline-flex items-center gap-3 transition hover:text-accent-300"
                >
                  <Mail className="h-4 w-4 text-accent-400" />
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                <span>
                  {siteConfig.contact.address.line1}
                  <br />
                  {siteConfig.contact.address.line2}
                </span>
              </li>
            </ul>

            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(([key, url]) => {
                  const SocialIcon = socialIcons[key];
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-accent-500"
                    >
                      <SocialIcon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-brand-200 transition hover:text-accent-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-brand-200 transition hover:text-accent-300"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours + CTA */}
          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Business Hours
            </h3>
            <ul className="mt-5 space-y-2 text-sm">
              {siteConfig.hours.map((h) => (
                <li
  key={h.day}
  className="grid grid-cols-[140px_1fr] items-center gap-4"
>
  <span className="text-brand-200">
    {h.day}
  </span>

  <span className="font-medium text-right whitespace-nowrap text-white">
    {h.time}
  </span>
</li>
              ))}
            </ul>
            <Link
              href="/book"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
            >
              Schedule an Inspection
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-wide flex flex-col items-center justify-between gap-4 py-6 text-xs text-brand-300 sm:flex-row">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {footerLegalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-white">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
