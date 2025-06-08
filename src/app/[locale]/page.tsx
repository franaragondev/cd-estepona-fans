"use client";

import AppHero from "@/components/App/AppHero";
import LatestNews from "@/components/App/LatestNews";
import NextMatchesPreview from "@/components/App/NextMatchesPreview";
import GalleryPreview from "@/components/App/GalleryPreview";
import UsefulLinks from "@/components/App/UsefulLinks";
import CallToAction from "@/components/CallToAction";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  return (
    <>
      <AppHero />
      <main className="max-w-7xl mx-auto px-4">
        <section className="py-10">
          <LatestNews />
        </section>
        <section className="py-10">
          <NextMatchesPreview />
        </section>
        <section className="py-10">
          <GalleryPreview />
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
