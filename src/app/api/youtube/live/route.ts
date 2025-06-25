import { NextResponse } from "next/server";

interface SearchResultItem {
  id: {
    videoId: string;
  };
}

interface SearchResponse {
  items: SearchResultItem[];
}

interface VideoSnippet {
  title: string;
  publishedAt: string;
  description: string;
  thumbnails: Record<string, { url: string; width: number; height: number }>;
  channelTitle: string;
}

interface VideoItem {
  id: string;
  snippet: VideoSnippet;
}

interface VideosResponse {
  items: VideoItem[];
}

// Caché en memoria para directos
let liveCache: { timestamp: number; data: VideoItem[] } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function GET() {
  const now = Date.now();

  if (liveCache && now - liveCache.timestamp < CACHE_DURATION) {
    return NextResponse.json(liveCache.data);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = "UCz4kCQiwLKzOAKVcO3019fg";
  const maxResults = 1;

  if (!apiKey) {
    console.error("Falta la clave API de YouTube");
    return NextResponse.json({ error: "Falta la clave API" }, { status: 500 });
  }

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&type=video&eventType=live&maxResults=${maxResults}`
    );

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error(
        "Error en búsqueda de directos:",
        searchRes.status,
        errorText
      );
      return NextResponse.json(
        { error: "Error en búsqueda de directos" },
        { status: 500 }
      );
    }

    const searchData = (await searchRes.json()) as SearchResponse;
    console.log("Search data:", searchData);

    if (searchData.items.length === 0) {
      console.log("No hay directos activos o programados.");
      return NextResponse.json([]);
    }

    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");
    console.log("Video IDs:", videoIds);

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet`
    );

    if (!videosRes.ok) {
      const errorText = await videosRes.text();
      console.error(
        "Error al cargar detalles de directos:",
        videosRes.status,
        errorText
      );
      return NextResponse.json(
        { error: "Error al cargar detalles de directos" },
        { status: 500 }
      );
    }

    const videosData = (await videosRes.json()) as VideosResponse;
    console.log("Videos data:", videosData);

    const videos = videosData.items.map((video) => ({
      id: video.id,
      snippet: video.snippet,
    }));

    // Guardar en caché
    liveCache = {
      timestamp: now,
      data: videos,
    };

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
