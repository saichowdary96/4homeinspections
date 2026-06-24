export type Faq = {
  question: string;
  answer: string;
  category: "General" | "Process" | "Pricing" | "Reports";
};

export const faqs: Faq[] = [
  {
    category: "General",
    question: "What is a home inspection?",
    answer:
      "A home inspection is a thorough, non-invasive visual examination of a property's accessible systems and components — including the roof, structure, electrical, plumbing, HVAC and more. It gives you an objective assessment of the home's condition so you can make an informed decision.",
  },
  {
    category: "General",
    question: "Do I need to be present during the inspection?",
    answer:
      "You're not required to attend, but we strongly encourage it — especially for the final 30–45 minutes. Being present lets you ask questions in real time and learn valuable maintenance tips about your future home.",
  },
  {
    category: "Process",
    question: "How long does an inspection take?",
    answer:
      "Most inspections take 2.5 to 4 hours depending on the size, age and condition of the home. We never rush — we take the time needed to do a thorough job.",
  },
  {
    category: "Process",
    question: "What happens if the inspector finds problems?",
    answer:
      "Finding issues is normal — no home is perfect. We document each finding with photos and clear explanations, categorize them by severity, and help you understand which items are minor maintenance versus significant concerns worth negotiating.",
  },
  {
    category: "Process",
    question: "Can I schedule an inspection online?",
    answer:
      "Absolutely. Use our online request form to pick your preferred date and service. We'll confirm your appointment quickly, usually within a few business hours.",
  },
  {
    category: "Pricing",
    question: "How much does a home inspection cost?",
    answer:
      "Pricing depends on the size, age and type of property, plus any add-on services like radon testing or thermal imaging. Buyer's inspections typically start at $375. Request a free, no-obligation quote for exact pricing.",
  },
  {
    category: "Pricing",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, debit cards and electronic transfers. Payment is collected at or before the time of inspection. Online payment options are coming soon.",
  },
  {
    category: "Reports",
    question: "When will I receive my report?",
    answer:
      "You'll receive a comprehensive, photo-rich digital report within 24 hours of the inspection — often the same day. Reports are easy to read, mobile-friendly and shareable with your agent.",
  },
  {
    category: "Reports",
    question: "What's included in the inspection report?",
    answer:
      "Your report includes detailed findings for every system, high-resolution photos, severity ratings, a summary of major concerns, and maintenance recommendations — all organized so you can act on it immediately.",
  },
  {
    category: "General",
    question: "Are you licensed and insured?",
    answer:
      "Yes. We are fully licensed, insured, and certified through leading industry organizations including InterNACHI® and ASHI. Your protection and peace of mind are our priority.",
  },
];
