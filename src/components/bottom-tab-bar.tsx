"use client";

import { usePathname, Link } from "@/i18n/navigation";

type Tab = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => React.ReactElement;
};

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 4.2-6 7.5-6s6 2 7.5 6" strokeLinecap="round" />
    </svg>
  );
}

function ListingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FindIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19.5 19.5 15 15" strokeLinecap="round" />
    </svg>
  );
}

function RequestsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M3.5 6.5 12 12.5l8.5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M5 4.5h9a3 3 0 0 1 3 3V19a2.5 2.5 0 0 0-2.5-2.5H5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 4.5V19" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomTabBar({
  profileLabel,
  listingsLabel,
  findLabel,
  requestsLabel,
  blogLabel,
}: {
  profileLabel: string;
  listingsLabel: string;
  findLabel: string;
  requestsLabel: string;
  blogLabel: string;
}) {
  const pathname = usePathname();

  const tabs: Tab[] = [
    { href: "/dashboard", label: profileLabel, icon: ProfileIcon },
    { href: "/dashboard/listings", label: listingsLabel, icon: ListingsIcon },
    { href: "/dashboard/find", label: findLabel, icon: FindIcon },
    { href: "/dashboard/requests", label: requestsLabel, icon: RequestsIcon },
    { href: "/dashboard/blog", label: blogLabel, icon: BlogIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {tabs.map((tab) => {
        const isActive = tab.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
              isActive ? "text-brand-navy" : "text-slate-400"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
