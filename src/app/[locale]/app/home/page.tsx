"use client";

import AppHero from "@/components/App/AppHero";
import LatestNews from "@/components/App/LatestNews";
import NextMatchesPreview from "@/components/App/NextMatchesPreview";
import GalleryPreview from "@/components/App/GalleryPreview";
import UsefulLinks from "@/components/App/UsefulLinks";

export default function HomePage() {
  return (
    <>
      {/* Hero a full width, sin contenedor */}
      <AppHero />

      {/* Resto dentro del contenedor centrado y limitado */}
      <main className="max-w-7xl mx-auto px-4">
        <section className="py-10">
          <LatestNews />
        </section>
        <section className="py-10 bg-gray-50">
          <NextMatchesPreview />
        </section>
        <section className="py-10">
          <GalleryPreview />
        </section>
        <UsefulLinks />
      </main>
    </>
  );
}
