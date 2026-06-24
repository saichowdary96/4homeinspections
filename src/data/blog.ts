/**
 * Blog / resources content. For now posts are stored here as structured data
 * with markdown-lite paragraph arrays. This is intentionally simple so it can
 * later be swapped for a CMS (Sanity, Contentful) or MDX without changing the
 * page components — they only depend on this shape.
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string; // ISO date
  readTime: string;
  /** Paragraphs of body copy. */
  content: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "10-things-every-home-buyer-should-know",
    title: "10 Things Every Home Buyer Should Know Before the Inspection",
    excerpt:
      "Preparing for your home inspection? Here's how to get the most value out of it and what to watch for as a buyer.",
    category: "Buying Tips",
    author: "Michael Reed",
    date: "2026-05-18",
    readTime: "6 min read",
    content: [
      "Buying a home is exciting — and a little overwhelming. The inspection is one of the most important steps in the process, yet many buyers don't know how to prepare for it. Here are ten things that will help you get the most out of your inspection.",
      "First, always attend the inspection if you can. Being present for even the last 30 minutes lets you ask questions and learn how your future home actually works.",
      "Second, remember that no home is perfect. Every inspection turns up issues — the goal is to understand which ones are minor maintenance and which are significant. A good inspector will help you tell the difference.",
      "Third, focus on the big-ticket systems: roof, foundation, electrical, plumbing and HVAC. These are the items that can cost thousands to repair, so prioritize understanding their condition.",
      "Finally, read the full report — not just the summary. The details often contain valuable maintenance tips that will save you money for years to come.",
    ],
  },
  {
    slug: "why-pre-listing-inspections-help-sellers",
    title: "Why a Pre-Listing Inspection Helps You Sell Faster",
    excerpt:
      "Sellers who inspect before listing often sell faster and with fewer surprises. Here's why it pays off.",
    category: "Selling Tips",
    author: "Michael Reed",
    date: "2026-04-29",
    readTime: "5 min read",
    content: [
      "Most people think of home inspections as something buyers do. But savvy sellers are increasingly ordering a pre-listing inspection — and for good reason.",
      "When you inspect before listing, you control the narrative. You can make repairs on your own schedule and budget rather than under the pressure of a tight closing timeline.",
      "A pre-listing inspection also reduces the risk of last-minute renegotiations. When the buyer's inspector confirms what you've already disclosed, deals are far less likely to fall apart.",
      "Finally, transparency builds trust. Sharing a clean inspection report signals to buyers that you've maintained the home well — often justifying a higher asking price.",
    ],
  },
  {
    slug: "understanding-radon-in-your-home",
    title: "Understanding Radon: The Invisible Risk in Your Home",
    excerpt:
      "Radon is the second leading cause of lung cancer. Learn what it is, why it matters, and how testing works.",
    category: "Home Safety",
    author: "Dana Mitchell",
    date: "2026-03-12",
    readTime: "4 min read",
    content: [
      "Radon is a naturally occurring radioactive gas that you can't see, smell or taste. It seeps up from the soil and can accumulate in homes to dangerous levels.",
      "According to the EPA, radon is the second leading cause of lung cancer in the United States and the number one cause among non-smokers.",
      "The good news is that radon is easy to test for. A certified continuous monitor measures levels over 48 hours and provides accurate, lab-grade results.",
      "If elevated levels are found, mitigation systems are affordable and highly effective — typically reducing radon to safe levels within days.",
    ],
  },
  {
    slug: "seasonal-home-maintenance-checklist",
    title: "The Ultimate Seasonal Home Maintenance Checklist",
    excerpt:
      "Protect your investment year-round with this simple, season-by-season home maintenance guide.",
    category: "Maintenance",
    author: "Dana Mitchell",
    date: "2026-02-02",
    readTime: "7 min read",
    content: [
      "Regular maintenance is the single best way to protect your home's value and avoid costly repairs. Here's a season-by-season checklist to keep you on track.",
      "In spring, inspect your roof and gutters for winter damage, check exterior caulking, and service your air conditioning before the heat arrives.",
      "In summer, focus on the exterior: power-wash siding, inspect the deck, and check for signs of pests or water intrusion.",
      "In fall, clean gutters again, service your heating system, seal gaps and drafts, and prepare outdoor plumbing for freezing temperatures.",
      "In winter, monitor for ice dams, test smoke and carbon monoxide detectors, and keep an eye on humidity to prevent condensation issues.",
    ],
  },
];

export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
