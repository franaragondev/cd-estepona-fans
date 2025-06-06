"use client";

import { useTranslations } from "next-intl";
import { Box, Camera, Timer, BarChart3 } from "lucide-react";

export default function Features() {
  const t = useTranslations("features");

  const features = [
    { icon: <Box size={32} />, title: t("pantry") },
    { icon: <Camera size={32} />, title: t("scan") },
    { icon: <Timer size={32} />, title: t("alerts") },
    { icon: <BarChart3 size={32} />, title: t("stats") },
  ];

  return (
    <section id="features" className="bg-gray-50 py-12 px-4">
      <h2 className="text-xl font-semibold text-center mb-8 text-black">
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 gap-6 max-w-md mx-auto sm:grid-cols-2">
        {features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="mb-2 text-black">{feature.icon}</div>
            <h3 className="text-gray-700 font-medium">{feature.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
