import type { ReactNode } from "react";

interface Props {
  id?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
}

/** Panel-Karte mit Kopfzeile, Trennlinie und Inhalt. */
export function Card({ id, title, subtitle, action, children, bodyClassName = "p-5" }: Props) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-20 rounded-xl border border-rule bg-sheet">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-rule px-5 py-4">
        <div>
          <h2 id={headingId} className="text-[15px] font-semibold">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
