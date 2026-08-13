import Link from "next/link";

export const metadata = {
  title: "Terms of Service — EnterRent",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-sm leading-6 text-slate-700">
      <Link href="/" className="text-xs text-slate-500 hover:underline">
        ← Back to EnterRent
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Terms of Service</h1>
      <p className="mt-1 text-xs text-slate-400">Last updated: August 2026</p>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="font-semibold text-slate-900">1. Who we are</h2>
          <p className="mt-1">
            EnterRent is operated by Delkom Ltd (&quot;EnterRent&quot;, &quot;we&quot;, &quot;us&quot;).
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the EnterRent
            website and services (the &quot;Service&quot;). By creating an account or using the Service,
            you agree to these Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">2. What EnterRent is — and isn&apos;t</h2>
          <p className="mt-1">
            EnterRent is a matching platform that helps verified Airbnb hosts find other hosts to
            (a) swap stays for personal travel, or (b) provide emergency backup hosting when a
            confirmed booking can no longer be honored at the original property.
          </p>
          <p className="mt-1">
            <strong>EnterRent is not a party to any arrangement made between hosts.</strong> We do
            not own, manage, book, or control any property listed or discussed through the
            Service. Any swap, backup hosting arrangement, payment, or other agreement between
            users is solely between those users. EnterRent is not a real estate broker, property
            manager, insurer, or travel agent.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">3. Eligibility and accounts</h2>
          <p className="mt-1">
            You must be at least 18 years old and able to form a binding contract to use the
            Service. You are responsible for the accuracy of the information in your profile and
            listings, and for keeping your account credentials secure.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">4. Verification</h2>
          <p className="mt-1">
            EnterRent may review host profiles and mark them as &quot;verified&quot; based on
            information the host provides, such as a linked Airbnb profile. Verification is not a
            guarantee of a host&apos;s identity, the condition of their property, or the accuracy of
            any information they provide. You are responsible for exercising your own judgment
            before entering into any arrangement with another user.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">5. Calendar and listing data</h2>
          <p className="mt-1">
            If you connect an iCal calendar URL, EnterRent reads availability data from that feed
            to display on your listing. You are responsible for the accuracy of your listing
            information and calendar data. EnterRent does not guarantee that synced calendar data
            is complete, current, or error-free.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">6. User responsibility and assumption of risk</h2>
          <p className="mt-1">
            Arranging a stay swap or emergency backup hosting with another user involves inherent
            risks, including property damage, disputes, safety concerns, and financial loss. You
            agree that any such arrangement is at your own risk, and that EnterRent is not
            responsible or liable for the conduct of any user, the condition of any property, or
            any dispute, loss, injury, or damage arising from an arrangement made through the
            Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">7. Prohibited conduct</h2>
          <p className="mt-1">
            You agree not to misuse the Service, including by providing false information,
            impersonating another person or property, harassing other users, or using the Service
            for any unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">8. Termination</h2>
          <p className="mt-1">
            We may suspend or terminate your account at our discretion, including for violation of
            these Terms. You may stop using the Service and request deletion of your account at
            any time.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">9. Disclaimers and limitation of liability</h2>
          <p className="mt-1">
            The Service is provided &quot;as is&quot; without warranties of any kind. To the maximum
            extent permitted by law, EnterRent and Delkom Ltd disclaim all warranties and will not
            be liable for any indirect, incidental, special, or consequential damages, or for any
            loss of property, income, or data, arising from your use of the Service or any
            arrangement made with another user.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">10. Indemnification</h2>
          <p className="mt-1">
            You agree to indemnify and hold harmless EnterRent and Delkom Ltd from any claims,
            damages, or expenses arising from your use of the Service, your listings, or your
            arrangements with other users.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">11. Governing law</h2>
          <p className="mt-1">
            These Terms are governed by the laws of the State of Israel, without regard to
            conflict-of-law principles. Any dispute arising from these Terms or the Service will
            be subject to the exclusive jurisdiction of the competent courts in Israel.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">12. Changes to these Terms</h2>
          <p className="mt-1">
            We may update these Terms from time to time. Continued use of the Service after a
            change constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">13. Contact</h2>
          <p className="mt-1">
            Questions about these Terms can be sent to{" "}
            <a href="mailto:noreply@enterent.org" className="text-blue-600 hover:underline">
              noreply@enterent.org
            </a>
            .
          </p>
        </section>

        <p className="mt-8 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          This document is a general-purpose template and has not been reviewed by a lawyer. It is
          not legal advice. Before onboarding real users, have these Terms reviewed by a qualified
          attorney familiar with Israeli law and the risks specific to a property-swap platform.
        </p>
      </div>
    </main>
  );
}
