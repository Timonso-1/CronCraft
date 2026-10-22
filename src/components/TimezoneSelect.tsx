"use client";

import { useEffect, useState } from "react";

const FALLBACK = ["UTC", "Europe/Berlin", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"];

function loadZones(): string[] {
  try {
    const zones = Intl.supportedValuesOf("timeZone");
    return zones.includes("UTC") ? zones : ["UTC", ...zones];
  } catch {
    return FALLBACK;
  }
}

interface Props {
  value: string;
  onChange: (tz: string) => void;
  label: string;
  className?: string;
}

export function TimezoneSelect({ value, onChange, label, className = "" }: Props) {
  const [zones, setZones] = useState<string[]>(FALLBACK);
  useEffect(() => setZones(loadZones()), []);
  const options = zones.includes(value) ? zones : [value, ...zones];

  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`max-w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-accent/70 ${className}`}
    >
      {options.map((z) => (
        <option key={z} value={z}>
          {z.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
