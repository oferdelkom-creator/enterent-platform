export type CountryCode = {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
};

export const COUNTRY_CODES: CountryCode[] = [
  { iso2: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { iso2: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { iso2: "IL", name: "Israel", dialCode: "+972", flag: "🇮🇱" },
  { iso2: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { iso2: "IE", name: "Ireland", dialCode: "+353", flag: "🇮🇪" },
  { iso2: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { iso2: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { iso2: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { iso2: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { iso2: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { iso2: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { iso2: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { iso2: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { iso2: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { iso2: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { iso2: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { iso2: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { iso2: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
  { iso2: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { iso2: "CZ", name: "Czechia", dialCode: "+420", flag: "🇨🇿" },
  { iso2: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
  { iso2: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
  { iso2: "CY", name: "Cyprus", dialCode: "+357", flag: "🇨🇾" },
  { iso2: "RO", name: "Romania", dialCode: "+40", flag: "🇷🇴" },
  { iso2: "HU", name: "Hungary", dialCode: "+36", flag: "🇭🇺" },
  { iso2: "UA", name: "Ukraine", dialCode: "+380", flag: "🇺🇦" },
  { iso2: "RU", name: "Russia", dialCode: "+7", flag: "🇷🇺" },
  { iso2: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { iso2: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { iso2: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { iso2: "JO", name: "Jordan", dialCode: "+962", flag: "🇯🇴" },
  { iso2: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { iso2: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { iso2: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { iso2: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { iso2: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { iso2: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { iso2: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { iso2: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { iso2: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { iso2: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { iso2: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { iso2: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { iso2: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { iso2: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
];

const TIMEZONE_TO_ISO2: Record<string, string> = {
  "Asia/Jerusalem": "IL",
  "Asia/Tel_Aviv": "IL",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Lisbon": "PT",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Brussels": "BE",
  "Europe/Zurich": "CH",
  "Europe/Vienna": "AT",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ",
  "Europe/Athens": "GR",
  "Europe/Istanbul": "TR",
  "Asia/Nicosia": "CY",
  "Europe/Bucharest": "RO",
  "Europe/Budapest": "HU",
  "Europe/Kyiv": "UA",
  "Europe/Moscow": "RU",
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Africa/Cairo": "EG",
  "Asia/Amman": "JO",
  "Africa/Johannesburg": "ZA",
  "Asia/Kolkata": "IN",
  "Asia/Shanghai": "CN",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Singapore": "SG",
  "Asia/Bangkok": "TH",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
  "America/Mexico_City": "MX",
  "America/Sao_Paulo": "BR",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Bogota": "CO",
  "America/Santiago": "CL",
};

function detectIso2(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const locale = navigator.language || navigator.languages?.[0];
    const region = locale?.split("-")[1]?.toUpperCase();
    if (region && COUNTRY_CODES.some((c) => c.iso2 === region)) {
      return region;
    }
  } catch {
    // ignore, fall through to timezone-based detection
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const iso2 = TIMEZONE_TO_ISO2[timeZone];
    if (iso2) return iso2;
  } catch {
    // ignore, no detection available
  }

  return null;
}

export function detectDefaultDialCode(): string {
  const iso2 = detectIso2();
  const match = iso2 && COUNTRY_CODES.find((c) => c.iso2 === iso2);
  return match ? match.dialCode : "+1";
}

export function detectDefaultCountryName(): string | null {
  const iso2 = detectIso2();
  const match = iso2 && COUNTRY_CODES.find((c) => c.iso2 === iso2);
  return match ? match.name : null;
}
