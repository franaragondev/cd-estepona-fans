import { NextResponse, NextRequest } from "next/server";
import { getAllSlugs } from "@/lib/getAllSlugs";

const SITE_URL = "https://www.cdesteponafans.com";
const locales = ["es", "en", "fr"];
const pages = [
  "",
  "cookies",
  "privacidad",
  "noticias",
  "partidos",
  "galeria",
  "tribuna",
];

async function generateSitemap(locale: string) {
  const urls: string[] = [];

  // Statics URLs
  for (const page of pages) {
    const path = page ? `/${page}` : "";
    urls.push(`${SITE_URL}/${locale}${path}`);
  }

  // Dynamics URLs
  const slugs = await getAllSlugs();
  slugs.forEach((slug) => {
    urls.push(`${SITE_URL}/${locale}/noticias/${slug}`);
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${urls
    .map((url) => {
      const urlObj = new URL(url);
      const path = urlObj.pathname.replace(/^\/(es|en|fr)/, "");
      const pageName = path.replace("/", "");

      const highPriorityPages = [
        "",
        "noticias",
        "partidos",
        "galeria",
        "tribuna",
      ];
      const priority = highPriorityPages.includes(pageName)
        ? "1.0"
        : ["cookies", "privacidad"].includes(pageName)
        ? "0.5"
        : "0.8";

      const hreflangs = locales
        .map(
          (loc) =>
            `<xhtml:link rel="alternate" hreflang="${loc}" href="${SITE_URL}/${loc}${path}" />`
        )
        .concat(
          `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/es${path}" />`
        )
        .join("\n      ");

      return `
  <url>
    <loc>${url}</loc>
    ${hreflangs}
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("\n")}
</urlset>`;
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1];

  if (!locales.includes(locale)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const sitemap = await generateSitemap(locale);
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
