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
  // Puedes añadir más campos que necesites aquí
}

interface VideoItem {
  id: string;
  snippet: VideoSnippet;
}

interface VideosResponse {
  items: VideoItem[];
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = "UCz4kCQiwLKzOAKVcO3019fg";
  const maxResults = 5;

  if (!apiKey) {
    console.error("Falta la clave API de YouTube");
    return NextResponse.json({ error: "Falta la clave API" }, { status: 500 });
  }

  try {
    const searchRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=id&order=date&type=video&maxResults=${maxResults}`
    );

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error(
        "Error en búsqueda de vídeos:",
        searchRes.status,
        errorText
      );
      return NextResponse.json(
        { error: "Error en búsqueda de vídeos" },
        { status: 500 }
      );
    }

    const searchData = (await searchRes.json()) as SearchResponse;

    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");

    const videosRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIds}&part=snippet`
    );

    if (!videosRes.ok) {
      const errorText = await videosRes.text();
      console.error(
        "Error al cargar detalles de vídeos:",
        videosRes.status,
        errorText
      );
      return NextResponse.json(
        { error: "Error al cargar detalles de vídeos" },
        { status: 500 }
      );
    }

    const videosData = (await videosRes.json()) as VideosResponse;

    const videos = videosData.items.map((video) => ({
      id: video.id,
      snippet: video.snippet,
    }));

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error interno del servidor:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
