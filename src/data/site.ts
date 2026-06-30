/**
 * ============================================================================
 *  SITE CONFIGURATION  —  EDIT THIS FILE TO CUSTOMIZE YOUR BUSINESS
 * ============================================================================
 *  Almost everything visitor-facing (business name, phone, email, address,
 *  social links, hours, stats, navigation) is driven from this single file.
 *  Replace the placeholder values below with your real business details.
 * ----------------------------------------------------------------------------
 */

export const siteConfig = {
  /** Brand / business name shown in the header, footer and metadata. */
  name: "4 Home Inspections",
  /** Short tagline used in heroes and the browser title template. */
 tagline: "Professional Home & Building Inspections",
  /** Longer description used for SEO meta descriptions and Open Graph. */
  description:
"4 Home Inspections provides professional home, apartment, villa and commercial building inspections. We deliver detailed inspection reports with photos to help buyers, owners and builders make confident decisions.",
  /** The canonical URL of your deployed site (update before going live). */
  url: "https://www.4homeinspections.in",
  /** Primary contact details — used across the site and in the footer. */
  contact: {
    phone: "(555) 123-4567",
    phoneHref: "tel:+15551234567",
    email: "hello@homeguardinspections.com",
    emailHref: "mailto:hello@homeguardinspections.com",
    address: {
      line1: "1420 Inspector Avenue, Suite 200",
      line2: "Austin, TX 78701",
      mapsQuery: "1420 Inspector Avenue, Austin, TX 78701",
    },
  },

  /** Business hours displayed in the footer and contact page. */
  hours: [
    { day: "Monday – Friday", time: "7:00 AM – 7:00 PM" },
    { day: "Saturday", time: "8:00 AM – 5:00 PM" },
    { day: "Sunday", time: "By appointment" },
  ],

  /** Social profiles — empty strings are hidden automatically. */
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    twitter: "",
  },

  /** Headline credibility stats shown on the homepage and About page. */
  stats: [
    { value: "12+", label: "Years of Experience" },
    { value: "8,500+", label: "Homes Inspected" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "24hr", label: "Report Turnaround" },
  ],

  /** Professional certifications / affiliations (logos optional). */
  certifications: [
    "InterNACHI® Certified",
    "ASHI Member",
    "TREC Licensed #12345",
    "Licensed & Insured",
    "Radon Certified",
    "Thermal Imaging Certified",
  ],
};

/** Primary navigation used by the header and mobile menu. */
export const mainNav: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Services", href: "/services" },
  { title: "Service Areas", href: "/service-areas" },
  { title: "Reviews", href: "/testimonials" },
  { title: "FAQ", href: "/faq" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

/** Secondary/legal links shown in the footer. */
export const footerLegalNav: { title: string; href: string }[] = [
  { title: "Privacy Policy", href: "/privacy" },
  { title: "Terms of Service", href: "/terms" },
  { title: "Sitemap", href: "/sitemap.xml" },
];

export type SiteConfig = typeof siteConfig;
