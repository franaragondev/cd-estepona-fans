import LatestNews from "@/components/App/LatestNews";
import { getNews } from "@/lib/latestNews";

export default async function LatestNewsServer() {
  const news = await getNews(6);

  // Convierte fechas a string si es necesario
  const latestNews = news.map((singleNew) => ({
    ...singleNew,
    createdAt: singleNew.createdAt.toISOString(),
  }));

  return <LatestNews latestNews={latestNews} />;
}
