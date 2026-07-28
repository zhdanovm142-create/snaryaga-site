import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import StructuredData from "@/components/site/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "СНАРЯГА36 — Маскировка нового поколения. ИК-защитная экипировка",
  description:
    "Разрабатываем и производим экипировку из экранирующих тканей, снижающих заметность в инфракрасном диапазоне. Защита от тепловизионных средств наблюдения.",
  keywords: [
    "Снаряга36",
    "ИК-защита",
    "маскировка",
    "тепловизор",
    "экранирующая ткань",
    "тактическая экипировка",
    "рюкзак ИК",
    "накидка маскировочная",
  ],
  authors: [{ name: "Снаряга36" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "СНАРЯГА36 — Маскировка нового поколения",
    description:
      "ИК-защитная экипировка: рюкзаки, накидки, костюмы из экранирующих тканей.",
    siteName: "Снаряга36",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${oswald.variable} antialiased bg-bg text-text`}
      >
        <StructuredData />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
