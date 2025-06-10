import GalleryPreview from "@/components/App/GalleryPreview";
import { getPhotos } from "@/lib/photos";

export default async function GalleryPreviewServer() {
  const photos = await getPhotos(6);

  const images = photos.map((photo) => photo.url);

  return <GalleryPreview images={images} />;
}
