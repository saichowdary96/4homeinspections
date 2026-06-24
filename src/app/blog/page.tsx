import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { CtaSection } from "@/components/sections/CtaSection";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog & Resources",
  description:
    "Expert home inspection tips, buying and selling guides, maintenance checklists and home safety resources.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        title="Tips, guides & resources"
        description="Practical advice to help you buy, sell, maintain and protect your home with confidence."
      />

      <Section>
        {/* Featured post */}
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition hover:shadow-card lg:grid-cols-2"
          >
            <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-brand-700 to-brand-950 p-10 lg:aspect-auto">
              <span className="font-display text-2xl font-bold text-white/90">
                {featured.category}
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className="inline-flex w-fit rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
                Featured
              </span>
              <h2 className="mt-4 text-2xl font-bold text-brand-900 group-hover:text-accent-600 lg:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-slate-600">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-5 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {formatDate(featured.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {featured.readTime}
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.1}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-brand-600 to-brand-800">
                  <span className="font-display text-lg font-semibold text-white/90">
                    {post.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-brand-900 group-hover:text-accent-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                    <span>{formatDate(post.date)}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-accent-600">
                      Read
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
