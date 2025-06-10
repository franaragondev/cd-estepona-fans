import type { News } from "@prisma/client";
import LatestNews from "@/components/App/LatestNews";
import { getNews } from "@/lib/news";

export default async function LatestNewsServer() {
  const news: News[] = await getNews(6);

  const latestNews = news.map((singleNew) => ({
    ...singleNew,
    createdAt: singleNew.createdAt.toISOString(),
  }));

  return <LatestNews latestNews={latestNews} />;
}
