# CronCraft

Webbasiertes Developer-Tool zum Erstellen, Verstehen und Testen von Cron-Ausdrücken.

## Funktionen

- Cron-Ausdruck eingeben (5 Felder oder 6 Felder mit Sekunden) und in verständlicher Sprache anzeigen (Deutsch/Englisch)
- Visueller Builder je Feld: jede/r, alle N, bestimmte Werte, eigener Wert
- Vorlagen für häufige Zeitpläne
- Nächste Ausführungszeitpunkte (5/10/20/50) inklusive Zeitumstellung
- Vergleich mehrerer Zeitzonen nebeneinander (bis zu 4)
- Teilbarer Link: Ausdruck, Zeitzonen und Sprache stehen in der URL

## Entwicklung

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run lint
npm run typecheck
npm run build
```

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, [cron-parser](https://github.com/harrisiirak/cron-parser), [cronstrue](https://github.com/bradymholt/cRonstrue), Vitest.

## Struktur

- `src/lib/cron/` - Beschreibung, Zeitplanberechnung, Builder-Helfer, Vorlagen (mit Tests)
- `src/components/` - UI-Komponenten
- `src/lib/i18n.ts` - Texte DE/EN
