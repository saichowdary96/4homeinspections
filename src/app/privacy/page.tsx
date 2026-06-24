import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { LegalContent } from "@/components/ui/LegalContent";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        title="Privacy Policy"
        description="Your privacy matters to us. This policy explains what information we collect and how we use it."
      />

      <Section>
        <LegalContent>
          <p className="text-sm text-slate-400">
            Last updated: January 1, 2026. This is a placeholder template —
            please review with a legal professional before publishing.
          </p>

          <div>
            <h2>1. Information We Collect</h2>
            <p>
              When you use our website or request an inspection, we may collect
              personal information you provide, such as your name, email address,
              phone number, and property address. We also collect basic analytics
              data about how visitors use our site.
            </p>
          </div>

          <div>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Schedule and perform your home inspection</li>
              <li>Deliver your inspection report and communicate with you</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Improve our website and services</li>
            </ul>
          </div>

          <div>
            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share information
              with trusted service providers who help us operate our business
              (such as scheduling or email tools), and only as necessary to
              provide our services.
            </p>
          </div>

          <div>
            <h2>4. Data Security</h2>
            <p>
              We take reasonable measures to protect your information from
              unauthorized access, alteration or disclosure. However, no method
              of transmission over the internet is completely secure.
            </p>
          </div>

          <div>
            <h2>5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal information at any time by contacting us at{" "}
              <a
                href={siteConfig.contact.emailHref}
                className="font-medium text-accent-600 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2>6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at {siteConfig.contact.phone} or {siteConfig.contact.email}.
            </p>
          </div>
        </LegalContent>
      </Section>
    </>
  );
}
