import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations("Landing");
  const steps = [0, 1, 2].map((i) => ({
    title: t(`steps.${i}.title`),
    description: t(`steps.${i}.description`),
  }));
  const useCases = [0, 1].map((i) => ({
    title: t(`useCases.${i}.title`),
    description: t(`useCases.${i}.description`),
    searchType: i === 0 ? "swap" : "backup",
  }));

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50">
      <header className="flex w-full items-center justify-between px-6 py-4">
        <Logo />
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/blog" className="text-slate-600 hover:text-slate-900">
            {t("nav.blog")}
          </Link>
          <Link href="/login" className="text-slate-600 hover:text-slate-900">
            {t("nav.login")}
          </Link>
          <LanguageSwitcher />
        </nav>
      </header>

      <section className="flex w-full flex-col items-center bg-brand-navy px-6 py-20 text-center text-white">
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold uppercase tracking-tight sm:text-4xl">
          {t("hero.title")}
        </h1>
        <p className="mt-4 max-w-xl text-sm text-slate-300">{t("hero.subtitle")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-md bg-brand-teal px-5 py-2.5 text-sm font-medium text-brand-navy-dark hover:bg-brand-teal-dark hover:text-white"
          >
            {t("hero.joinCta")}
          </Link>
          <a
            href="#how-it-works"
            className="rounded-md border border-white/30 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
          >
            {t("hero.howItWorksCta")}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-300">
          {[0, 1, 2].map((i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
              {t(`trustBadges.${i}`)}
            </span>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="w-full max-w-4xl scroll-mt-6 px-6 py-16">
        <h2 className="text-center text-xl font-semibold text-slate-900">{t("howItWorks.title")}</h2>
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
          <h2 className="text-center text-xl font-semibold text-slate-900">{t("useCasesTitle")}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="rounded-xl border-2 border-brand-teal/30 bg-brand-teal/5 p-6"
              >
                <p className="text-lg font-semibold text-brand-navy">{useCase.title}</p>
                <p className="mt-2 text-sm text-slate-600">{useCase.description}</p>
                <Link
                  href={`/search?type=${useCase.searchType}`}
                  className="mt-4 inline-block rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-light"
                >
                  {useCase.searchType === "swap" ? t("useCases.0.searchCta") : t("useCases.1.searchCta")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex w-full flex-col items-center px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-slate-900">{t("readyToJoin.title")}</h2>
        <p className="mt-2 max-w-md text-sm text-slate-600">{t("readyToJoin.subtitle")}</p>
        <Link
          href="/signup"
          className="mt-6 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-light"
        >
          {t("hero.joinCta")}
        </Link>
      </section>

      <div className="mb-16 flex gap-4 text-xs text-slate-400">
        <Link href="/blog" className="hover:underline">
          {t("nav.blog")}
        </Link>
        <span>·</span>
        <Link href="/terms" className="hover:underline">
          {t("footer.terms")}
        </Link>
        <span>·</span>
        <Link href="/privacy" className="hover:underline">
          {t("footer.privacy")}
        </Link>
      </div>
    </main>
  );
}
