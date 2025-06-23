import type { Metadata } from "next";
import { getCommonMetadata } from "@/utils/getCommonMetadata";
import ConfirmModal from "@/components/ConfirmModal";
import AppHero from "@/components/App/AppHero";
import LatestNewsServer from "@/components/LatestNewsServer";
import NextMatchesPreview from "@/components/App/NextMatchesPreview";
import GalleryPreviewServer from "@/components/GalleryPreviewServer";
import UsefulLinks from "@/components/App/UsefulLinks";
import CallToAction from "@/components/CallToAction";
import FAQ from "@/components/FAQ";

export const revalidate = 60;

export async function generateMetadata(ctx: any): Promise<Metadata> {
  const locale = ctx.params.locale;
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
