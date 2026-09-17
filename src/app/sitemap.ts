import type { MetadataRoute } from "next";

/**
 * Карта сайта — генерируется Next.js на этапе сборки (static export)
 * и попадает в out/sitemap.xml.
 *
 * Сайт одностраничный (лендинг-магазин): все секции на главной,
 * поэтому в карте только корневой URL. При добавлении новых страниц
 * (например, /blog, /o-kompanii) — добавляйте их сюда.
 *
 * Домен указан в punycode (ASCII), как требует формат sitemap.xml.
 * Человекочитаемая форма: https://снаряга36.рф
 */
const SITE_URL = "https://xn--36-6kcao2dwaf3k.xn--p1ai";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
