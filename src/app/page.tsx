import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">EnterRent</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold text-slate-900 sm:text-4xl">
        A trusted network for verified Airbnb hosts to swap stays and cover each other in an emergency
      </h1>
      <p className="mt-4 max-w-xl text-sm text-slate-600">
        Connect your Airbnb listing, get verified, and find another host nearby to trade vacations with —
        or to step in when your place suddenly can&apos;t host a confirmed booking.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Join as a host
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-white"
        >
          Log in
        </Link>
      </div>

      <div className="mt-16 flex gap-4 text-xs text-slate-400">
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
