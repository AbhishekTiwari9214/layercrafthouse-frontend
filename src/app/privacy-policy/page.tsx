import type { Metadata } from "next";

const effectiveDate = "October 2, 2026";
const appName = "Layer Craft House";
const websiteUrl = "https://layercrafthouse.com";
const supportEmail = "support@layercrafthouse.com";

export const metadata: Metadata = {
  title: `Privacy Policy | ${appName}`,
  description:
    "Privacy Policy for Layer Craft House, including Google Sign-In and data handling details.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="app-page">
      <div className="app-page-glow" />
      <div className="app-page-grid" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:px-12 md:py-20">
        <article className="app-card space-y-8">
          <header className="space-y-4">
            <p className="label-caps text-warm-gray">Legal</p>
            <h1 className="editorial-headline text-4xl text-ivory md:text-6xl">Privacy Policy</h1>
            <p className="text-sm leading-relaxed text-warm-gray md:text-base">
              Effective Date: {effectiveDate}
            </p>
            <p className="text-sm leading-relaxed text-warm-gray md:text-base">
              This Privacy Policy explains how {appName} ("we", "our", or "us") collects, uses,
              stores, and protects your information when you use our website and services at{" "}
              {websiteUrl}.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="step-heading">1. Information We Collect</h2>
            <p className="step-copy">
              When you use Google Sign-In, we collect specific Google account information, including:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-warm-gray md:text-base">
              <li>Email address</li>
              <li>Full name</li>
              <li>Profile picture</li>
            </ul>
            <p className="step-copy">
              We may also collect basic technical data such as browser type, device information, and
              usage logs for security and performance monitoring.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">2. How We Use Your Information</h2>
            <p className="step-copy">We use your information only for legitimate business purposes, including:</p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-warm-gray md:text-base">
              <li>Authentication and secure sign-in</li>
              <li>Account creation and account management</li>
              <li>Providing core app functionality and personalized user experience</li>
              <li>Improving security, preventing abuse, and troubleshooting issues</li>
            </ul>
            <p className="step-copy">
              We do not use Google user data for advertising profiling, and we do not access any
              Google data beyond what is required for sign-in and account setup.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">3. Data Sharing and Disclosure</h2>
            <p className="step-copy">
              We do not sell your personal data to third parties. We may share limited information
              only in the following cases:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-warm-gray md:text-base">
              <li>With trusted service providers who support essential operations under strict confidentiality</li>
              <li>To comply with legal obligations, court orders, or valid government requests</li>
              <li>To protect the rights, safety, and security of our users, systems, and services</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">4. Data Retention</h2>
            <p className="step-copy">
              We retain personal data only as long as necessary to provide our services, comply with
              legal obligations, resolve disputes, and enforce agreements. You may request account
              deletion by contacting us at {supportEmail}.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">5. Security</h2>
            <p className="step-copy">
              We implement reasonable technical and organizational safeguards to protect your data.
              However, no online transmission or storage method is completely secure. We continuously
              work to improve our protections.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">6. Your Rights</h2>
            <p className="step-copy">
              Depending on your jurisdiction, you may have rights to access, correct, delete, or
              restrict processing of your personal information. To make a request, email us at{" "}
              {supportEmail}.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">7. Children&apos;s Privacy</h2>
            <p className="step-copy">
              Our services are not directed to children under the age required by applicable law, and
              we do not knowingly collect personal data from children.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">8. Changes to This Policy</h2>
            <p className="step-copy">
              We may update this Privacy Policy from time to time. Updated versions will be posted on
              this page with a revised effective date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">9. Contact Us</h2>
            <p className="step-copy">
              If you have questions about this Privacy Policy or our data practices, contact us at:
            </p>
            <p className="text-sm leading-relaxed text-ivory md:text-base">
              {appName}
              <br />
              Website: {websiteUrl}
              <br />
              Email: {supportEmail}
            </p>
          </section>
        </article>
      </section>
    </main>
  );
}
