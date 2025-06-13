import { NextResponse } from "next/server";

const SITE_URL = "https://www.cdesteponafans.com";
const locales = ["es", "en", "fr"];

export async function GET() {
  const sitemaps = locales
    .map(
      (locale) => `
  <sitemap>
    <loc>${SITE_URL}/${locale}/sitemap.xml</loc>
  </sitemap>`
    )
    .join("");

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}
</sitemapindex>
`;

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
