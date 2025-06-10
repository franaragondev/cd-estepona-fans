import GalleryFull from "@/components/GalleryFull";
import { getAllPhotos } from "@/lib/photos";

export default async function GalleryPage() {
  const photos = await getAllPhotos();
  const images = photos.map(({ url, caption }) => ({
    url,
    caption: caption ?? undefined, // convierte null en undefined
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 min-h-[85vh]">
      <GalleryFull images={images} />
    </main>
  );
}
