import GalleryFull from "@/components/GalleryFull";
import { getAcademyPhotos } from "@/lib/photos";

export default async function GalleryPage() {
  const photos = await getAcademyPhotos();
  const images = photos.map(({ url, caption }) => ({
    url,
    caption: caption ?? undefined,
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12 min-h-[85vh]">
      <h1 className="sr-only">
        Galería de Imágenes de la Cantera del CD Estepona
      </h1>
      <GalleryFull images={images} />
    </main>
  );
}
