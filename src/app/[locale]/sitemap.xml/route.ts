import { NextResponse, NextRequest } from "next/server";

const SITE_URL = "https://cd-estepona-fans.vercel.app";
const locales = ["es", "en", "fr"];
const pages = ["", "cookies", "privacy"];

function generateSitemap(locale: string) {
  const urls: string[] = [];

  for (const page of pages) {
    const path = page ? `/${page}` : "";
    urls.push(`${SITE_URL}/${locale}${path}`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
  ${urls
    .map((url) => {
      const urlObj = new URL(url);
      const path = urlObj.pathname.replace(/^\/(es|en|fr)/, "");

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
      <priority>${
        url.endsWith("/cookies") || url.endsWith("/privacy") ? "0.5" : "1.0"
      }</priority>
    </url>`;
    })
    .join("")}
</urlset>`;
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.pathname.split("/")[1];

  if (!["es", "en", "fr"].includes(locale)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const sitemap = generateSitemap(locale);
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
