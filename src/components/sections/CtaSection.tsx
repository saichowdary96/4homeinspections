import { Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export function CtaSection({
  title = "Ready to schedule your inspection?",
  description = "Book online in minutes or call us today. Same-day appointments are often available — let's get you the answers you deserve.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-900">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:44px_44px] opacity-30" />
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="container-wide relative py-16 lg:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-brand-100">
            {description}
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/book" size="lg">
              Book Inspection Online
            </Button>
            <Button
              href={siteConfig.contact.phoneHref}
              size="lg"
              variant="white"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
