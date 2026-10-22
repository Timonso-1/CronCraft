import type { ReactNode } from "react";

interface Props {
  number: number;
  title: string;
  subtitle: string;
  id?: string;
  children: ReactNode;
}

/** Nummerierter Arbeitsschritt: Eingeben, Anpassen, Prüfen. */
export function Step({ number, title, subtitle, id, children }: Props) {
  return (
    <section id={id ?? `step-${number}`} aria-labelledby={`step-${number}-title`} className="scroll-mt-20 space-y-5">
      <header className="flex items-start gap-4">
        <span
          aria-hidden
          className="grid size-8 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 font-mono text-sm font-semibold text-accent"
        >
          {number}
        </span>
        <div>
          <h2 id={`step-${number}-title`} className="text-lg font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-ink-soft">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}
