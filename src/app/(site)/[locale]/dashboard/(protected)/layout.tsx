import { getLocale, getTranslations } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/logo";
import LanguageSwitcher from "@/components/language-switcher";
import BottomTabBar from "@/components/bottom-tab-bar";
import SignOutButton from "./sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale: await getLocale() });
  }

  const t = await getTranslations("DashboardNav");

  const navItems = [
    { href: "/dashboard", label: t("profile") },
    { href: "/dashboard/listings", label: t("myListings") },
    { href: "/dashboard/find", label: t("findHosts") },
    { href: "/dashboard/requests", label: t("requests") },
    { href: "/dashboard/blog", label: t("blog") },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="hidden shrink-0 border-r border-slate-200 bg-white px-4 py-6 md:block md:w-56">
        <div className="mb-8 flex items-center justify-between px-2">
          <Logo iconClassName="h-6 w-6" />
          <LanguageSwitcher />
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-4">
          <p className="truncate px-2 text-xs text-slate-400">{user!.email}</p>
          <SignOutButton />
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <Logo iconClassName="h-6 w-6" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <SignOutButton />
        </div>
      </div>

      <main className="min-w-0 flex-1 p-4 pb-20 md:p-8 md:pb-8">{children}</main>

      <BottomTabBar
        profileLabel={t("profile")}
        listingsLabel={t("myListings")}
        findLabel={t("findHosts")}
        requestsLabel={t("requests")}
        blogLabel={t("blog")}
      />
    </div>
  );
}
