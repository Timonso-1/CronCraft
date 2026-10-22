interface Stat {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}

/** Kennzahlenleiste wie im Panel: Label, große Zahl, kleiner Hinweis. */
export function Stats({ items }: { items: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-y-6 border-y border-rule py-6 md:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="min-w-0 pr-4">
          <dt className="text-[11px] font-medium tracking-[0.12em] text-ink-soft uppercase">{s.label}</dt>
          <dd className={`mt-1.5 truncate text-2xl font-semibold tabular-nums ${s.accent ? "text-accent" : ""}`}>{s.value}</dd>
          {s.hint && <dd className="mt-0.5 truncate text-xs text-ink-soft">{s.hint}</dd>}
        </div>
      ))}
    </dl>
  );
}
