import type { Metadata } from "next";

const effectiveDate = "October 2, 2026";
const appName = "Layer Craft House";
const websiteUrl = "https://layercrafthouse.com";
const supportEmail = "support@layercrafthouse.com";

export const metadata: Metadata = {
  title: `Terms of Service | ${appName}`,
  description: "Terms of Service for Layer Craft House.",
};

export default function TermsOfServicePage() {
  return (
    <main className="app-page">
      <div className="app-page-glow" />
      <div className="app-page-grid" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-16 md:px-12 md:py-20">
        <article className="app-card space-y-8">
          <header className="space-y-4">
            <p className="label-caps text-warm-gray">Legal</p>
            <h1 className="editorial-headline text-4xl text-ivory md:text-6xl">Terms of Service</h1>
            <p className="text-sm leading-relaxed text-warm-gray md:text-base">
              Effective Date: {effectiveDate}
            </p>
            <p className="text-sm leading-relaxed text-warm-gray md:text-base">
              These Terms of Service ("Terms") govern your access to and use of {appName} and our
              website at {websiteUrl}. By using our services, you agree to these Terms.
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="step-heading">1. Eligibility and Account Access</h2>
            <p className="step-copy">
              You must provide accurate information and be legally capable of entering into binding
              agreements to use our services. You are responsible for maintaining the confidentiality
              of your account and for all activity under your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">2. Google Sign-In</h2>
            <p className="step-copy">
              Our platform supports Google OAuth sign-in. By signing in with Google, you authorize us
              to receive your Google account email address, name, and profile picture for
              authentication, account creation, and core app functionality.
            </p>
            <p className="step-copy">
              Your use of Google Sign-In must also comply with Google&apos;s applicable terms and
              policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">3. Acceptable Use</h2>
            <p className="step-copy">You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-warm-gray md:text-base">
              <li>Use the service for unlawful, fraudulent, or abusive activities</li>
              <li>Attempt unauthorized access to any system, account, or data</li>
              <li>Interfere with platform integrity, security, or performance</li>
              <li>Misrepresent your identity or submit false account details</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">4. Intellectual Property</h2>
            <p className="step-copy">
              All content, branding, software, and materials provided through {appName} are owned by
              us or our licensors and are protected by applicable intellectual property laws. You may
              not copy, modify, distribute, or reverse engineer our services except as allowed by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">5. Privacy</h2>
            <p className="step-copy">
              Your use of the service is also governed by our Privacy Policy. We do not sell your
              personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">6. Service Availability</h2>
            <p className="step-copy">
              We may update, modify, suspend, or discontinue all or part of the service at any time,
              with or without notice. We are not liable for service interruptions or feature changes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">7. Disclaimers</h2>
            <p className="step-copy">
              Services are provided on an "as is" and "as available" basis without warranties of any
              kind, express or implied, including merchantability, fitness for a particular purpose,
              and non-infringement, to the fullest extent permitted by law.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">8. Limitation of Liability</h2>
            <p className="step-copy">
              To the fullest extent permitted by law, {appName} and its affiliates will not be liable
              for indirect, incidental, special, consequential, or punitive damages, or for loss of
              data, profits, or revenue arising from your use of the services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">9. Termination</h2>
            <p className="step-copy">
              We may suspend or terminate access if you violate these Terms, create legal risk, or
              misuse the platform. You may stop using the service at any time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">10. Changes to These Terms</h2>
            <p className="step-copy">
              We may update these Terms periodically. Continued use after changes become effective
              constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">11. Governing Law</h2>
            <p className="step-copy">
              These Terms are governed by applicable laws of the jurisdiction in which {appName} is
              operated, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="step-heading">12. Contact</h2>
            <p className="step-copy">For questions regarding these Terms, contact us at:</p>
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
