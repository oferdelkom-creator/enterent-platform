export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="enterrent-logo-gradient" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#0f2942" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <path
        d="M6 44V20L24 6L42 20V44"
        stroke="url(#enterrent-logo-gradient)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M18 44V26C18 24.3431 19.3431 23 21 23H27C28.6569 23 30 24.3431 30 26V44"
        fill="url(#enterrent-logo-gradient)"
      />
      <circle cx="26.5" cy="34" r="1.4" fill="white" />
    </svg>
  );
}

export function Logo({
  className = "",
  iconClassName = "h-8 w-8",
  tagline,
}: {
  className?: string;
  iconClassName?: string;
  tagline?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoMark className={iconClassName} />
      <div>
        <span className="text-lg font-bold tracking-tight text-brand-navy">
          Enter<span className="text-brand-teal-dark">Rent</span>
        </span>
        {tagline && <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{tagline}</p>}
      </div>
    </div>
  );
}
