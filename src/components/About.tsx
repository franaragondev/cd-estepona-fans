"use client";

import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="px-4 py-16 text-center bg-white">
      <h2 className="text-xl font-semibold mb-4 text-black">{t("title")}</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        <strong>{t("highlight-description")} </strong>
        {t("description")}
      </p>
    </section>
  );
}
