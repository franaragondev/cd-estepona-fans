import { getAllSlugs } from "@/lib/getAllSlugs";

export async function GET() {
  const slugs = await getAllSlugs();
  const baseUrl = "https://www.cdesteponafans.com";
  const locales = ["es", "en", "fr"];

  const urls = slugs.flatMap((slug) =>
    locales.map(
      (locale) => `<url><loc>${baseUrl}/${locale}/noticias/${slug}</loc></url>`
    )
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
