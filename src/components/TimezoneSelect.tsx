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
  id?: string;
}

export function TimezoneSelect({ value, onChange, label, id }: Props) {
  const [zones, setZones] = useState<string[]>(FALLBACK);
  useEffect(() => setZones(loadZones()), []);
  const options = zones.includes(value) ? zones : [value, ...zones];

  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-black/15 bg-background px-2 py-1.5 text-sm dark:border-white/20"
    >
      {options.map((z) => (
        <option key={z} value={z}>
          {z}
        </option>
      ))}
    </select>
  );
}
