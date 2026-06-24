export type Testimonial = {
  name: string;
  role: string;
  rating: number;
  quote: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Sarah & Mark Thompson",
    role: "First-time Home Buyers",
    rating: 5,
    location: "Austin, TX",
    quote:
      "As first-time buyers we were nervous, but our inspector walked us through every detail and made us feel completely at ease. The report was incredibly thorough and we caught a roof issue that saved us thousands.",
  },
  {
    name: "Jennifer Alvarez",
    role: "Real Estate Agent",
    rating: 5,
    location: "Round Rock, TX",
    quote:
      "I refer all my clients here. The reports are clear, the turnaround is fast, and they explain findings without scaring buyers away. Truly a professional partner in every transaction.",
  },
  {
    name: "David Chen",
    role: "Home Seller",
    rating: 5,
    location: "Cedar Park, TX",
    quote:
      "The pre-listing inspection was the best money I spent. We fixed a few items up front, listed with confidence, and sold above asking with zero renegotiation. Highly recommend.",
  },
  {
    name: "Rachel Morrison",
    role: "New Construction Buyer",
    rating: 5,
    location: "Leander, TX",
    quote:
      "I almost skipped an inspection because the home was brand new. So glad I didn't — they found several issues the builder fixed before closing. Worth every penny.",
  },
  {
    name: "The Patel Family",
    role: "Annual Maintenance Client",
    rating: 5,
    location: "Pflugerville, TX",
    quote:
      "We schedule an annual inspection every year now. They caught a small water leak before it became a major problem. Professional, punctual, and genuinely caring.",
  },
  {
    name: "Tom Richardson",
    role: "Investor",
    rating: 5,
    location: "Georgetown, TX",
    quote:
      "I've used a lot of inspectors for my rental properties and these folks are by far the most detailed and responsive. The online booking and digital reports make my life so much easier.",
  },
];
