import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { CtaSection } from "@/components/sections/CtaSection";
import { Button } from "@/components/ui/Button";
import { blogPosts, getPostBySlug } from "@/data/blog";
import { formatDate } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default function BlogPostPage({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: post.category },
        ]}
        title={post.title}
      >
        <div className="flex flex-wrap items-center gap-5 text-sm text-brand-200">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-4 w-4 text-accent-400" />
            {post.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-accent-400" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-accent-400" />
            {post.readTime}
          </span>
        </div>
      </PageHeader>

      <Section>
        <article className="mx-auto max-w-3xl">
          <div className="prose-custom space-y-6 text-lg leading-relaxed text-slate-700">
            {post.content.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <Button href="/blog" variant="ghost">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Button>
          </div>
        </article>
      </Section>

      <Section className="bg-slate-50">
        <h2 className="text-2xl font-bold text-brand-900">Keep reading</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                {p.category}
              </span>
              <h3 className="mt-2 text-lg font-bold text-brand-900 group-hover:text-accent-600">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
