export const revalidate = 60;

import AppHero from "@/components/App/AppHero";
import LatestNewsServer from "@/components/LatestNewsServer";
import NextMatchesPreview from "@/components/App/NextMatchesPreview";
import GalleryPreviewServer from "@/components/GalleryPreviewServer";
import UsefulLinks from "@/components/App/UsefulLinks";
import CallToAction from "@/components/CallToAction";
import FAQ from "@/components/FAQ";
import ConfirmModal from "@/components/ConfirmModal";
import { getCommonMetadata } from "@/utils/getCommonMetadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  return await getCommonMetadata(locale);
}

export default function HomePage() {
  return (
    <>
      <ConfirmModal />
      <AppHero />
      <main className="max-w-7xl mx-auto px-4">
        <section className="py-10">
          <LatestNewsServer />
        </section>
      </main>
      <section className="py-10">
        <NextMatchesPreview />
      </section>
      <main className="max-w-7xl mx-auto px-4">
        <section className="py-10">
          <GalleryPreviewServer />
        </section>
      </main>
      <section className="py-10">
        <CallToAction />
      </section>
      <FAQ />
      <UsefulLinks />
    </>
  );
}
