"use client";

import { useEffect, useState } from "react";
import { COUNTRY_CODES, detectDefaultDialCode } from "@/lib/country-codes";

export default function PhoneInput({
  name = "phone",
  defaultValue,
}: {
  name?: string;
  defaultValue?: string | null;
}) {
  const [dialCode, setDialCode] = useState("+1");
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (defaultValue) {
      const match = [...COUNTRY_CODES]
        .sort((a, b) => b.dialCode.length - a.dialCode.length)
        .find((c) => defaultValue.startsWith(c.dialCode));

      if (match) {
        setDialCode(match.dialCode);
        setNumber(defaultValue.slice(match.dialCode.length).trim());
        return;
      }

      setNumber(defaultValue);
      return;
    }

    setDialCode(detectDefaultDialCode());
  }, [defaultValue]);

  const combined = number.trim() ? `${dialCode} ${number.trim()}` : "";

  return (
    <div className="flex gap-2">
      <select
        value={dialCode}
        onChange={(e) => setDialCode(e.target.value)}
        aria-label="Country code"
        className="w-28 shrink-0 rounded-md border border-slate-300 px-2 py-2 text-sm focus:border-slate-500 focus:outline-none"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={`${c.iso2}-${c.dialCode}`} value={c.dialCode}>
            {c.flag} {c.dialCode}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="50 123 4567"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
      />
      <input type="hidden" name={name} value={combined} />
    </div>
  );
}
