/**
 * Service catalog. Each service powers both the Services grid and its own
 * detail page at /services/[slug]. Add, remove or edit freely — pages are
 * generated automatically from this array.
 */

export type Service = {
  slug: string;
  title: string;
  /** Short one-liner for cards. */
  summary: string;
  /** Lucide icon name (see components/ui/Icon mapping). */
  icon: string;
  /** Starting price shown on cards (string for flexibility). */
  priceFrom: string;
  /** Typical duration. */
  duration: string;
  /** Hero/intro paragraph on the detail page. */
  intro: string;
  /** Bullet list of what's included / inspected. */
  includes: string[];
  /** Who this service is best for. */
  bestFor: string;
  /** Optional highlighted feature flag for the homepage. */
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: "buyers-inspection",
    title: "Buyer's Home Inspection",
    summary:
      "A complete top-to-bottom evaluation before you close, so you buy with confidence.",
    icon: "Home",
    priceFrom: "$375",
    duration: "2.5 – 3.5 hrs",
    featured: true,
    intro:
      "Buying a home is likely the biggest investment you'll ever make. Our comprehensive buyer's inspection examines every accessible component of the property so you know exactly what you're getting — before you sign. You'll receive a clear, photo-rich report within 24 hours, plus a walkthrough to answer every question.",
    includes: [
      "Roof, gutters, flashing & chimney",
      "Foundation, grading & drainage",
      "Structural components & framing",
      "Electrical panel, wiring & outlets",
      "Plumbing supply, drains & water heater",
      "HVAC heating & cooling systems",
      "Attic, insulation & ventilation",
      "Interior walls, ceilings, floors & windows",
      "Doors, stairs & safety hazards",
      "Appliances & built-in systems",
    ],
    bestFor: "Home buyers under contract who want full peace of mind.",
  },
  {
    slug: "sellers-inspection",
    title: "Seller's / Pre-Listing Inspection",
    summary:
      "Find and fix issues before listing to sell faster and avoid renegotiations.",
    icon: "Tag",
    priceFrom: "$350",
    duration: "2.5 – 3.5 hrs",
    featured: true,
    intro:
      "A pre-listing inspection puts you in the driver's seat. By identifying issues before your home hits the market, you can make repairs on your own terms, price accurately, and reduce the risk of last-minute buyer renegotiations or deal-killing surprises.",
    includes: [
      "Full property condition assessment",
      "Prioritized repair recommendations",
      "Disclosure-ready documentation",
      "Photo-rich, easy-to-share report",
      "Optional re-inspection after repairs",
      "Talking points for your listing agent",
    ],
    bestFor: "Sellers who want a smooth, surprise-free transaction.",
  },
  {
    slug: "new-construction",
    title: "New Construction Inspection",
    summary:
      "Independent verification that your brand-new home was built to standard.",
    icon: "HardHat",
    priceFrom: "$425",
    duration: "3 – 4 hrs",
    featured: true,
    intro:
      "New doesn't always mean flawless. Builders work fast and oversights happen. Our new construction inspection — ideally completed before your final walkthrough — gives you an unbiased, third-party review so the builder addresses defects before you take ownership.",
    includes: [
      "Pre-drywall structural review (optional phase)",
      "Final walkthrough inspection",
      "Code-adjacent quality checks",
      "Builder punch-list documentation",
      "Systems & appliance verification",
      "11-month warranty inspection reminder",
    ],
    bestFor: "Buyers of newly built homes before closing or warranty expiry.",
  },
  {
    slug: "annual-maintenance",
    title: "Annual Home Maintenance Inspection",
    summary:
      "Catch small problems early and protect your home's value year after year.",
    icon: "CalendarCheck",
    priceFrom: "$295",
    duration: "2 – 3 hrs",
    intro:
      "Your home is constantly aging. An annual maintenance inspection helps you stay ahead of costly repairs by identifying wear, leaks, safety concerns and deferred maintenance early — when they're small and inexpensive to fix.",
    includes: [
      "Seasonal systems check-up",
      "Roof & exterior wear assessment",
      "Plumbing & water-intrusion review",
      "Electrical safety screening",
      "HVAC performance check",
      "Prioritized maintenance to-do list",
    ],
    bestFor: "Current homeowners protecting their long-term investment.",
  },
  {
    slug: "radon-testing",
    title: "Radon Testing",
    summary:
      "Certified testing for the #1 cause of lung cancer in non-smokers.",
    icon: "Wind",
    priceFrom: "$150",
    duration: "48 hr test",
    intro:
      "Radon is an invisible, odorless radioactive gas and the leading cause of lung cancer among non-smokers. Our certified continuous radon monitors provide accurate, EPA-protocol testing so you know your home's air is safe to breathe.",
    includes: [
      "EPA-protocol continuous monitoring",
      "Certified placement & retrieval",
      "Lab-grade accurate results",
      "Clear pass/fail interpretation",
      "Mitigation guidance if needed",
    ],
    bestFor: "Any buyer or homeowner concerned about indoor air quality.",
  },
  {
    slug: "thermal-imaging",
    title: "Thermal Imaging & Moisture",
    summary:
      "See what the naked eye can't — hidden leaks, heat loss and electrical hot spots.",
    icon: "Thermometer",
    priceFrom: "$125",
    duration: "Add-on",
    intro:
      "Using professional-grade infrared cameras, we detect issues invisible during a standard visual inspection: moisture intrusion behind walls, missing insulation, overheating electrical components and energy-loss areas — giving you a deeper layer of protection.",
    includes: [
      "Infrared scan of accessible areas",
      "Hidden moisture detection",
      "Insulation gap mapping",
      "Electrical hot-spot identification",
      "Energy-efficiency insights",
    ],
    bestFor: "Buyers who want the most thorough inspection available.",
  },
];

export const getServiceBySlug = (slug: string) =>
  services.find((s) => s.slug === slug);

export const featuredServices = services.filter((s) => s.featured);
