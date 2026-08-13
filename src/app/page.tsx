import Link from "next/link";
import { Logo } from "@/components/logo";

const steps = [
  {
    title: "1. Connect your listing",
    description:
      "Add your Airbnb profile link and property details. Connect your calendar so hosts can see real availability.",
  },
  {
    title: "2. Get verified",
    description:
      "Our team reviews your host profile before you're discoverable to other verified hosts on the network.",
  },
  {
    title: "3. Swap or ask for backup",
    description:
      "Browse verified hosts, propose a stay swap for your own vacation, or request emergency backup hosting when your place suddenly can't take a confirmed booking.",
  },
];

const useCases = [
  {
    title: "Stay swaps",
    description:
      "Trade vacations with a verified host in another city or country — you stay at their place while they stay at yours, for the dates you both agree on.",
  },
  {
    title: "Emergency backup",
    description:
      "When a burst pipe, a lockout, or a last-minute issue means your place can't host a confirmed booking, find another verified host nearby who can step in.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50">
      <header className="flex w-full items-center justify-between px-6 py-4">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/blog" className="text-slate-600 hover:text-slate-900">
            Blog
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            Log in
          </Link>
        </nav>
      </header>

      <section className="flex w-full flex-col items-center bg-brand-navy px-6 py-20 text-center text-white">
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold sm:text-4xl">
          A trusted network for verified Airbnb hosts to swap stays and cover each other in an
          emergency
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-300">
          Connect your Airbnb listing, get verified, and find another host nearby to trade
          vacations with — or to step in when your place suddenly can&apos;t host a confirmed
          booking.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-brand-teal px-5 py-2.5 text-sm font-medium text-brand-navy-dark hover:bg-brand-teal-dark hover:text-white"
          >
            Join as a host
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      </section>

      <section className="w-full max-w-4xl px-6 py-16">
        <h2 className="text-center text-xl font-semibold text-slate-900">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-medium text-brand-navy">{step.title}</p>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-semibold text-slate-900">
            Two ways to use EnterRent
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border-2 border-brand-teal/30 bg-brand-teal/5 p-6"
              >
                <p className="text-lg font-semibold text-brand-navy">{useCase.title}</p>
                <p className="mt-2 text-sm text-slate-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-900">Ready to join?</h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">
          It&apos;s free to create a host profile and get verified.
        </p>
        <Link
          href="/signup"
          className="mt-6 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-light"
        >
          Join as a host
        </Link>
      </section>

      <div className="mb-16 flex gap-4 text-xs text-slate-400">
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <span>·</span>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <span>·</span>
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
    </main>
  );
}
