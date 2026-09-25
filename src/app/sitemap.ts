import type { MetadataRoute } from "next";

/**
 * Карта сайта — генерируется Next.js на этапе сборки (static export)
 * и попадает в out/sitemap.xml.
 *
 * В карте — ТОЛЬКО реальные страницы (отдают 200 OK):
 *  — «/»          — одностраничный лендинг-магазин (все секции — якоря,
 *                    отдельными URL в sitemap НЕ попадают: #contact и
 *                    прочие хэши не являются самостоятельными адресами);
 *  — «/contact/»  — отдельная страница контактов (src/app/contact/page.tsx).
 *
 * Домен указан в punycode (ASCII), как требует формат sitemap.xml.
 * Человекочитаемая форма: https://снаряга36.рф
 *
 * НЕ добавлять сюда: якоря (#...), ?utm_*, http://, www, index.html,
 * дубли на кириллице. При добавлении новых страниц (/blog и т.п.) —
 * добавляйте их сюда ТОЛЬКО после того, как страница реально существует.
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
    {
      url: `${SITE_URL}/contact/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
