import React from "react";
import LegalLayout, { Section, Bullets } from "./LegalLayout";

const LAST_UPDATED = "14 June 2026";

/**
 * Terms & Conditions for P-Lease-Grid — a pre-leased commercial real-estate
 * marketplace + sales CRM for the Indian market. Tailored to the actual product:
 * Owners/Brokers list pre-leased commercial properties, Investors/buyers submit
 * enquiries, and an internal sales team verifies and distributes leads.
 */
const TermsAndConditions = () => (
  <LegalLayout title="Terms & Conditions" lastUpdated={LAST_UPDATED}>
    <p>
      Welcome to P-Lease-Grid. These Terms &amp; Conditions ("Terms") govern your
      access to and use of the P-Lease-Grid platform, a marketplace for pre-leased
      commercial real estate in India connecting property owners, brokers and
      investors. By creating an account, listing a property, submitting an enquiry
      or otherwise using the platform, you agree to be bound by these Terms.
    </p>

    <Section heading="1. About the platform">
      <p>
        P-Lease-Grid lists commercial properties that are typically already leased
        to a tenant ("pre-leased") and marketed to investors on the basis of their
        rental yield and return profile. The platform also provides internal sales
        tooling to verify listings and manage enquiries. P-Lease-Grid is an
        intermediary that facilitates discovery and contact between parties; it is
        not a party to any lease, sale or investment transaction.
      </p>
    </Section>

    <Section heading="2. Eligibility & accounts">
      <Bullets
        items={[
          "You must be at least 18 years old and legally capable of entering into a binding contract.",
          "You are responsible for the accuracy of the information in your account and for keeping your login credentials confidential.",
          "Brokers listing on behalf of a client confirm they are duly authorised to do so.",
          "We may suspend or deactivate accounts that violate these Terms or that we reasonably believe are fraudulent.",
        ]}
      />
    </Section>

    <Section heading="3. Property listings">
      <Bullets
        items={[
          "Owners and brokers are solely responsible for the accuracy, completeness and legality of every listing, including carpet area, lease terms, rent, financial figures, title status, RERA details and supporting documents.",
          "Listings may be reviewed and verified by our internal sales team before being marked verified. Verification is a reasonableness check and is not a guarantee of accuracy, title or returns.",
          "You must not list property you are not authorised to market, or post misleading, duplicate or unlawful content.",
          "Financial metrics such as gross/net rental yield and payback period shown on listings are computed by the platform from the figures you provide and are indicative only.",
        ]}
      />
    </Section>

    <Section heading="4. Enquiries & lead handling">
      <p>
        When an investor or prospective tenant submits an enquiry, their contact
        details may be shared with the relevant owner/broker and assigned to a
        sales representative for follow-up. You agree to use enquiry information
        only for genuine, lawful dealings relating to the property and not for
        unsolicited marketing.
      </p>
    </Section>

    <Section heading="5. No investment, legal or financial advice">
      <p>
        Pre-leased real estate involves risk. Yields, ROI and projections on the
        platform are estimates and not assured returns. Nothing on P-Lease-Grid
        constitutes investment, legal, tax or financial advice. You should conduct
        your own due diligence and consult professional advisors before
        transacting. P-Lease-Grid is not responsible for the performance of any
        property or investment.
      </p>
    </Section>

    <Section heading="6. Acceptable use">
      <Bullets
        items={[
          "Do not attempt to gain unauthorised access to the platform, other accounts, or our systems and data.",
          "Do not scrape, copy or resell listing or user data without written permission.",
          "Do not upload malware or content that infringes third-party rights or violates Indian law.",
        ]}
      />
    </Section>

    <Section heading="7. Intellectual property">
      <p>
        The platform, its design, software and branding are owned by P-Lease-Grid
        and its licensors. By uploading content (including property photos and
        documents) you grant us a non-exclusive licence to host and display that
        content for the purpose of operating the platform.
      </p>
    </Section>

    <Section heading="8. Limitation of liability">
      <p>
        To the maximum extent permitted by law, P-Lease-Grid is provided "as is".
        We are not liable for any indirect or consequential loss, or for losses
        arising from your reliance on listings, financial estimates, enquiries or
        third-party conduct. Our total liability for any claim relating to the
        platform is limited to the fees (if any) you paid to us in the preceding
        twelve months.
      </p>
    </Section>

    <Section heading="9. Changes to these Terms">
      <p>
        We may update these Terms from time to time. Continued use of the platform
        after changes take effect constitutes acceptance of the revised Terms.
      </p>
    </Section>

    <Section heading="10. Governing law">
      <p>
        These Terms are governed by the laws of India, and the courts at the
        location of P-Lease-Grid's registered office shall have exclusive
        jurisdiction over any dispute.
      </p>
    </Section>

    <Section heading="11. Contact">
      <p>
        For questions about these Terms, contact us at{" "}
        <a href="mailto:soham@dolphingroup.net.in" className="text-[#EE2529] underline">
          soham@dolphingroup.net.in
        </a>
        .
      </p>
    </Section>
  </LegalLayout>
);

export default TermsAndConditions;
