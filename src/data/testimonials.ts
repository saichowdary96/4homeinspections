export type Testimonial = {
  name: string;
  role: string;
  rating: number;
  quote: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Rohit Kumar",
    role: "Home Buyer",
    rating: 5,
    location: "Gachibowli, Hyderabad",
    quote:
      "Excellent inspection service. The engineer identified plumbing and electrical issues that we had completely missed. The detailed report helped us get everything fixed by the builder before possession.",
  },
  {
    name: "Priya Reddy",
    role: "Apartment Owner",
    rating: 5,
    location: "Kondapur, Hyderabad",
    quote:
      "Very professional and punctual team. The inspection report included clear photographs and detailed explanations. Highly recommended before taking possession of a new apartment.",
  },
  {
    name: "Venkatesh Rao",
    role: "Villa Buyer",
    rating: 5,
    location: "Miyapur, Hyderabad",
    quote:
      "Booking was simple and the inspection was completed professionally. They found several construction defects that the builder rectified before handover. Worth every rupee.",
  },
  {
    name: "Sneha Sharma",
    role: "First-Time Home Buyer",
    rating: 5,
    location: "Kokapet, Hyderabad",
    quote:
      "As first-time buyers we wanted complete peace of mind. The inspection was thorough and easy to understand. We felt much more confident before moving into our new home.",
  },
  {
    name: "Arun Kumar",
    role: "Property Investor",
    rating: 5,
    location: "Narsingi, Hyderabad",
    quote:
      "I've worked with several inspection companies, but 4 Home Inspections provided the most detailed report I've received. Fast turnaround and professional service from start to finish.",
  },
  {
    name: "Lakshmi Narayan",
    role: "Homeowner",
    rating: 5,
    location: "Tellapur, Hyderabad",
    quote:
      "Outstanding service. The team inspected every corner of the property and explained each observation clearly. The digital report with photographs was extremely helpful.",
  },
];