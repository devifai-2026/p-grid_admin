import React from "react";
import LegalLayout, { Section, Bullets } from "./LegalLayout";

const LAST_UPDATED = "14 June 2026";

/**
 * Privacy Policy for P-Lease-Grid. Reflects the data the product actually
 * handles: account + KYC details, property listing data (incl. RERA, title and
 * financial figures), enquiry/contact data, uploaded media and usage logs.
 */
const PrivacyPolicy = () => (
  <LegalLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
    <p>
      This Privacy Policy explains how P-Lease-Grid ("we", "us") collects, uses and
      protects your information when you use our pre-leased commercial real-estate
      marketplace and sales platform. We are committed to handling your data
      responsibly and in line with applicable Indian data-protection law.
    </p>

    <Section heading="1. Information we collect">
      <Bullets
        items={[
          "Account details: name, email, mobile number, role (owner, broker, investor or staff) and password.",
          "Verification/KYC details you provide as an owner or broker, such as RERA number and supporting documents.",
          "Property listing data: location, carpet area, lease and rent terms, financial figures, title/legal status, photos and other media you upload.",
          "Enquiry data: the contact details and messages submitted when you enquire about a property.",
          "Usage and device data: log data, IP address, pages viewed and actions taken, used to operate and secure the platform.",
        ]}
      />
    </Section>

    <Section heading="2. How we use your information">
      <Bullets
        items={[
          "To create and manage your account and authenticate your access.",
          "To publish property listings and compute indicative financial metrics (e.g. rental yield) from the figures you provide.",
          "To route enquiries to the relevant owner/broker and assign them to our sales team for follow-up.",
          "To verify listings, prevent fraud, and maintain audit logs of key actions.",
          "To improve the platform and communicate service-related updates.",
        ]}
      />
    </Section>

    <Section heading="3. How we share information">
      <p>
        We share information only as needed to operate the platform:
      </p>
      <Bullets
        items={[
          "Enquiry contact details are shared with the relevant property owner/broker and assigned sales representative.",
          "Listing information you publish is visible to investors and prospective tenants on the marketplace.",
          "Service providers (e.g. cloud hosting, file storage, communication and analytics) process data on our behalf under confidentiality obligations.",
          "We may disclose information where required by law or to protect our legal rights.",
        ]}
      />
      <p>We do not sell your personal data.</p>
    </Section>

    <Section heading="4. Data storage & security">
      <p>
        Your data is stored on managed cloud infrastructure with access controls,
        encryption in transit, and audit logging. While we take reasonable
        technical and organisational measures to protect your information, no
        system is completely secure and we cannot guarantee absolute security.
      </p>
    </Section>

    <Section heading="5. Data retention">
      <p>
        We retain personal data for as long as your account is active or as needed
        to provide the service, comply with legal obligations, resolve disputes and
        enforce our agreements. Listing and enquiry records may be retained for
        audit and compliance purposes after a listing is removed.
      </p>
    </Section>

    <Section heading="6. Your rights">
      <Bullets
        items={[
          "Access and review the personal information we hold about you.",
          "Request correction of inaccurate details (most can be updated from your profile).",
          "Request deletion of your account, subject to legal and audit retention requirements.",
          "Opt out of non-essential communications.",
        ]}
      />
      <p>
        To exercise any of these rights, contact us using the details below.
      </p>
    </Section>

    <Section heading="7. Cookies & tracking">
      <p>
        We use cookies and similar technologies to keep you signed in, remember
        preferences and understand how the platform is used. You can control
        cookies through your browser settings, though some features may not work
        without them.
      </p>
    </Section>

    <Section heading="8. Children's privacy">
      <p>
        The platform is intended for users aged 18 and over and is not directed at
        children. We do not knowingly collect personal data from minors.
      </p>
    </Section>

    <Section heading="9. Changes to this policy">
      <p>
        We may update this Privacy Policy periodically. Material changes will be
        reflected by updating the "Last updated" date above.
      </p>
    </Section>

    <Section heading="10. Contact">
      <p>
        For privacy questions or requests, contact us at{" "}
        <a href="mailto:privacy@preleasegrid.com" className="text-[#EE2529] underline">
          privacy@preleasegrid.com
        </a>
        .
      </p>
    </Section>
  </LegalLayout>
);

export default PrivacyPolicy;
