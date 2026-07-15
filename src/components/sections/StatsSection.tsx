import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export function StatsSection() {
  return (
    <section className="bg-brand-900">
      <div className="container-wide py-14">
        <dl className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3">
          {siteConfig.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-4xl font-extrabold text-white lg:text-5xl">
                  {stat.value}
                </span>
                <span className="mt-2 block text-sm font-medium text-brand-200">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
