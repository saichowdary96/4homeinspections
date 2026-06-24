import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Icon } from "./Icon";
import type { Service } from "@/data/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-accent-200 hover:shadow-card"
    >
      <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:bg-accent-500 group-hover:text-white">
        <Icon name={service.icon} className="h-7 w-7" />
      </div>

      <h3 className="text-xl font-bold text-brand-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {service.summary}
      </p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">From</p>
          <p className="font-display text-lg font-bold text-brand-900">
            {service.priceFrom}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          {service.duration}
        </div>
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
        Learn more
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
