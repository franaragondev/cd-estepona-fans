import type { NewsTranslation } from "@prisma/client";
import { getNews } from "@/lib/news";
import LatestNews from "@/components/App/LatestNews";

interface ServerNews {
  id: string;
  slug: string;
  title: string;
  createdAt: Date;
  image: string | null;
  published: boolean;
  translations: NewsTranslation[];
}

export default async function LatestNewsServer() {
  const news: ServerNews[] = await getNews(6);

  const latestNews = news.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    createdAt: n.createdAt.toISOString(),
    image: n.image,
    published: n.published,
    translations: n.translations,
  }));

  return <LatestNews latestNews={latestNews} />;
}
