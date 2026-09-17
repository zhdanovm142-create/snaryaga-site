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

// Кириллический домен снаряга36.рф в punycode — безопасен для robots.txt,
// sitemap.xml, canonical и og:url (всё должно быть в ASCII).
export const SITE_URL = "https://xn--36-6kcao2dwaf3k.xn--p1ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Верификация панелей вебмастеров (коды предоставлены владельцем сайта):
  // - Google Search Console: meta-тег google-site-verification
  //   (альтернатива — DNS TXT, уже не требуется, пока meta в билде)
  // - Яндекс.Вебмастер: meta-тег yandex-verification
  //   (плюс файл yandex_40b673b993338f11.html в public/ — двойная схема,
  //    сработает любой из способов)
  verification: {
    google: "S247pV9rj4NrXLqqU0EscFlY73aGiRyO-bfPHkcgorM",
    yandex: "40b673b993338f11",
  },
  title: "СНАРЯГА36 — Маскировка нового поколения. ИК-защитная экипировка",
  description:
    "Разрабатываем и производим экипировку из экранирующих тканей, снижающих заметность в инфракрасном диапазоне. Защита от тепловизионных средств наблюдения.",
  alternates: {
    canonical: "/",
  },
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
    // favicon.ico в корне обязателен: робот Яндекса ищет иконку именно по
    // адресу /favicon.ico — без него иконки в выдаче Яндекса не будет.
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "СНАРЯГА36 — Маскировка нового поколения",
    description:
      "ИК-защитная экипировка: рюкзаки, накидки, костюмы из экранирующих тканей.",
    siteName: "Снаряга36",
    type: "website",
    locale: "ru_RU",
    url: "/",
    // SVG как og:image соцсети (VK/Telegram) не понимают — берём растровое фото.
    images: [
      {
        url: "/products/ir-after.png",
        width: 1344,
        height: 768,
        alt: "Экипировка СНАРЯГА36, невидимая в ИК-диапазоне (съёмка тепловизором)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/products/ir-after.png"],
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
