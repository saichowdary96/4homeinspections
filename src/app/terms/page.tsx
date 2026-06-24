import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { LegalContent } from "@/components/ui/LegalContent";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms and conditions governing the use of ${siteConfig.name}'s website and services.`,
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]}
        title="Terms of Service"
        description="Please read these terms carefully. They govern your use of our website and services."
      />

      <Section>
        <LegalContent>
          <p className="text-sm text-slate-400">
            Last updated: January 1, 2026. This is a placeholder template —
            please review with a legal professional before publishing.
          </p>

          <div>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing our website or using our services, you agree to be
              bound by these Terms of Service. If you do not agree, please do not
              use our website or services.
            </p>
          </div>

          <div>
            <h2>2. Scope of Inspection Services</h2>
            <p>
              A home inspection is a visual, non-invasive examination of the
              accessible systems and components of a property at the time of the
              inspection. It is not a warranty, guarantee, or insurance policy
              against future defects.
            </p>
          </div>

          <div>
            <h2>3. Limitations</h2>
            <ul>
              <li>We inspect only readily accessible areas and components.</li>
              <li>
                We do not move furniture, lift carpets, or perform destructive
                testing.
              </li>
              <li>
                Conditions may change after the inspection date and are outside
                our control.
              </li>
            </ul>
          </div>

          <div>
            <h2>4. Payment</h2>
            <p>
              Payment is due at or before the time of inspection unless otherwise
              agreed in writing. Reports may be withheld until payment is
              received.
            </p>
          </div>

          <div>
            <h2>5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, our liability is limited as
              described in your signed inspection agreement. This website&rsquo;s
              content is provided for informational purposes only.
            </p>
          </div>

          <div>
            <h2>6. Contact</h2>
            <p>
              Questions about these terms? Contact us at{" "}
              {siteConfig.contact.phone} or {siteConfig.contact.email}.
            </p>
          </div>
        </LegalContent>
      </Section>
    </>
  );
}
