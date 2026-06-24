import { Quote } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Testimonial } from "@/data/testimonials";

export function TestimonialCard({ item }: { item: Testimonial }) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-7 shadow-soft">
      <Quote className="h-8 w-8 text-accent-200" aria-hidden="true" />
      <StarRating rating={item.rating} className="mt-4" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">
        &ldquo;{item.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 font-display text-sm font-bold text-brand-800">
          {initials}
        </span>
        <span>
          <span className="block text-sm font-bold text-brand-900">
            {item.name}
          </span>
          <span className="block text-xs text-slate-500">
            {item.role} &middot; {item.location}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
