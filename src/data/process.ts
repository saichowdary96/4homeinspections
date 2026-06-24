/** The 4-step "how it works" process shown on the homepage. */

export type ProcessStep = {
  step: string;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: "01",
    title: "Book Online",
    description:
      "Request your inspection in minutes using our simple online form. Pick your service and preferred date.",
    icon: "CalendarPlus",
  },
  {
    step: "02",
    title: "We Inspect",
    description:
      "A certified inspector performs a thorough, non-invasive evaluation of every accessible system in the home.",
    icon: "Search",
  },
  {
    step: "03",
    title: "Get Your Report",
    description:
      "Receive a detailed, photo-rich digital report within 24 hours — often the same day as your inspection.",
    icon: "FileText",
  },
  {
    step: "04",
    title: "Make Confident Decisions",
    description:
      "We walk you through the findings and answer every question, so you can move forward with total confidence.",
    icon: "ShieldCheck",
  },
];

/** "Why choose us" trust pillars. */
export type Benefit = {
  title: string;
  description: string;
  icon: string;
};

export const benefits: Benefit[] = [
  {
    title: "Certified & Insured",
    description:
      "Fully licensed, insured and certified by InterNACHI® and ASHI for your complete protection.",
    icon: "BadgeCheck",
  },
  {
    title: "Same-Day Reports",
    description:
      "Detailed, easy-to-read digital reports delivered within 24 hours — usually the same day.",
    icon: "Zap",
  },
  {
    title: "Thorough & Honest",
    description:
      "We inspect every accessible component and tell you the truth — no upselling, no scare tactics.",
    icon: "Eye",
  },
  {
    title: "Modern Technology",
    description:
      "Thermal imaging, drones and moisture meters help us find what the naked eye can't.",
    icon: "Cpu",
  },
  {
    title: "Buyer-Friendly Walkthrough",
    description:
      "We explain findings in plain English and answer all your questions on-site.",
    icon: "MessageCircle",
  },
  {
    title: "Satisfaction Guaranteed",
    description:
      "We stand behind our work with a 100% satisfaction commitment on every inspection.",
    icon: "Award",
  },
];
