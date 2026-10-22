
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
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        title="Privacy Policy"
        description="This policy explains how 4 Home Inspections handles personal information when you visit our website or request our services."
      />

      <Section>
        <LegalContent>
          <p className="text-sm text-slate-400">
            Last updated: October 22, 2026.
          </p>

          <div>
            <h2>1. Information We Collect</h2>
            <p>
              We may collect information you provide when contacting us
              or requesting an inspection, including your name, phone
              number, email address, property address, appointment details,
              and information about your property. Inspection photographs
              and findings may also be collected as part of the service.
            </p>
            <p>
              We may collect basic technical or usage information through
              website logs, analytics, cookies, or similar technologies
              where these tools are enabled.
            </p>
          </div>

          <div>
            <h2>2. How We Use Your Information</h2>
            <ul>
              <li>Respond to enquiries and provide quotations.</li>
              <li>Schedule and perform requested property inspections.</li>
              <li>Prepare and deliver inspection reports.</li>
              <li>Communicate about appointments, findings, and services.</li>
              <li>Maintain business records and improve our website.</li>
              <li>Meet applicable legal obligations.</li>
            </ul>
          </div>

          <div>
            <h2>3. WhatsApp, Calls, and Enquiries</h2>
            <p>
              If you contact us by telephone, email, website form, or
              WhatsApp, we use the information you provide to respond
              to your request and coordinate our services. Those
              communication platforms may process information under
              their own privacy policies.
            </p>
          </div>

          <div>
            <h2>4. Sharing of Information</h2>
            <p>
              We do not sell personal information. We may share relevant
              information with service providers or other parties when
              reasonably necessary to deliver a requested service, operate
              our website, or comply with applicable law. We aim to limit
              sharing to what is necessary for the relevant purpose.
            </p>
          </div>

          <div>
            <h2>5. Data Security and Retention</h2>
            <p>
              We take reasonable measures to protect personal information
              against unauthorized access, loss, alteration, or disclosure.
              Information is retained for as long as reasonably necessary
              for the purposes described in this policy, or as required
              by applicable law.
            </p>
          </div>

          <div>
            <h2>6. Your Privacy Requests</h2>
            <p>
              Subject to applicable law, you may contact us to request
              access to, correction of, or deletion of personal information
              we hold about you. We may need to retain certain records
              to meet legal or business obligations.
            </p>
          </div>

          <div>
            <h2>7. Cookies and Third-Party Services</h2>
            <p>
              Our website may use cookies, analytics, hosting, or
              advertising services where enabled. These services may
              process technical information in accordance with their
              own privacy policies. Please ensure this section accurately
              describes the tools used on your website.
            </p>
          </div>

          <div>
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy when our practices or
              legal requirements change. The latest version will be
              published on this page with its revision date.
            </p>
          </div>

          <div>
            <h2>9. Contact Us</h2>
            <p>
              For questions or requests concerning this policy, contact
              us using the telephone number or email address published
              on our website.
            </p>
            <p>
              Phone: {siteConfig.contact.phone}
              <br />
              Email:{" "}
              <a
                href={siteConfig.contact.emailHref}
                className="font-medium text-accent-600 hover:underline"
              >
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </LegalContent>
      </Section>
    </>
  );
}
