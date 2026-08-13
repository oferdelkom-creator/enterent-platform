import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — EnterRent",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-sm leading-6 text-slate-700">
      <Link href="/" className="text-xs text-slate-500 hover:underline">
        ← Back to EnterRent
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Privacy Policy</h1>
      <p className="mt-1 text-xs text-slate-400">Last updated: August 2026</p>

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="font-semibold text-slate-900">1. Who we are</h2>
          <p className="mt-1">
            EnterRent is operated by Delkom Ltd. This policy explains what information we collect
            when you use EnterRent and how we use it.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">2. Information we collect</h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>Account information: name, email address, phone number, city, country.</li>
            <li>Listing information: property details, Airbnb listing links, and calendar
              availability data retrieved from an iCal URL you provide.</li>
            <li>If you sign in with Google or Facebook, we receive your name, email, and profile
              photo from that provider.</li>
            <li>Requests and messages you send to other hosts through the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">3. How we use this information</h2>
          <p className="mt-1">
            We use your information to operate the Service: creating and verifying your profile,
            displaying your listings to other verified hosts, matching swap and backup requests,
            syncing calendar availability, and sending account-related emails (verification,
            password resets, invites).
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">4. Sharing with other users</h2>
          <p className="mt-1">
            Your name, city/country, and listing details are visible to other verified hosts on
            the Service so they can evaluate a potential swap or backup arrangement. Your email
            and phone number are not shown to other users unless you choose to share them
            directly.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">5. Third-party service providers</h2>
          <p className="mt-1">
            We use Supabase for authentication and data storage, and Resend for transactional
            email delivery. These providers process your data on our behalf and are bound by
            their own data protection obligations.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">6. Data retention and deletion</h2>
          <p className="mt-1">
            We retain your account data for as long as your account is active. You can request
            deletion of your account and associated data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">7. Your rights</h2>
          <p className="mt-1">
            You may access, correct, or delete your personal information at any time from your
            account, or by contacting us.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-slate-900">8. Contact</h2>
          <p className="mt-1">
            Questions about this policy can be sent to{" "}
            <a href="mailto:noreply@enterent.org" className="text-blue-600 hover:underline">
              noreply@enterent.org
            </a>
            .
          </p>
        </section>

        <p className="mt-8 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
          This document is a general-purpose template and has not been reviewed by a lawyer. Before
          onboarding real users, have this policy reviewed for compliance with applicable privacy
          law (e.g. Israel&apos;s Privacy Protection Law, and GDPR if you expect EU users).
        </p>
      </div>
    </main>
  );
}
