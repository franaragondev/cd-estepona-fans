/** @type {import('next-sitemap').IConfig} */
const siteUrl = "https://www.cdesteponafans.com";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "daily",
  priority: 0.7,
  exclude: ["/**/admin", "/**/admin/**"],
  additionalPaths: async () => {
    const locales = ["es", "en", "fr"];
    const staticPages = [
      "", // Home
      "galeria",
      "noticias",
      "partidos",
      "privacidad",
      "cookies",
      "tribuna",
      "directos",
    ];

    const urls = [];
    for (const locale of locales) {
      for (const page of staticPages) {
        urls.push({
          loc: `${siteUrl}/${locale}${page ? `/${page}` : ""}`,
          changefreq: "daily",
          priority: 0.7,
        });
      }
    }

    return urls;
  },
};
