import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Logo } from "@/components/logo";
import SignOutButton from "./sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const navItems = [
    { href: "/dashboard", label: "Profile" },
    { href: "/dashboard/listings", label: "My listings" },
    { href: "/dashboard/find", label: "Find hosts" },
    { href: "/dashboard/requests", label: "Requests" },
    { href: "/dashboard/blog", label: "Blog" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white px-4 py-4 md:w-56 md:border-b-0 md:border-r md:py-6">
        <div className="mb-3 px-2 md:mb-8">
          <Logo iconClassName="h-6 w-6" />
        </div>
        <nav className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 md:block"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3 md:mt-8 md:block md:pt-4">
          <p className="truncate px-2 text-xs text-slate-400">{user.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
