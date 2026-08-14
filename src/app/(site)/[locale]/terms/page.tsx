import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Terms of Service — EnterRent",
};

type Section = { title: string; body: string };

export default function TermsPage() {
  const t = useTranslations("Terms");
  const sections = t.raw("sections") as Section[];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-sm leading-6 text-slate-700">
      <Link href="/" className="text-xs text-slate-500 hover:underline">
        {t("back")}
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-slate-900">{t("title")}</h1>
      <p className="mt-1 text-xs text-slate-400">{t("lastUpdated")}</p>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-semibold text-slate-900">{section.title}</h2>
            <p className="mt-1 whitespace-pre-line">{section.body}</p>
          </section>
        ))}

        <section>
          <h2 className="font-semibold text-slate-900">{t("contactTitle")}</h2>
          <p className="mt-1">
            {t("contactBody")}{" "}
            <a href="mailto:noreply@enterent.org" className="text-blue-600 hover:underline">
              noreply@enterent.org
            </a>
            .
          </p>
        </section>

        <p className="mt-8 rounded-md bg-amber-50 p-3 text-xs text-amber-800">{t("disclaimer")}</p>
      </div>
    </main>
  );
}
