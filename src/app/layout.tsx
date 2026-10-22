import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CronCraft",
  description:
    "Cron-Ausdrücke erstellen, verstehen und testen - mit Zeitzonen-Vorschau der nächsten Ausführungen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
