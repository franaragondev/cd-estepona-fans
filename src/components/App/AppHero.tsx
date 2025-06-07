import ParallaxBackground from "../ParallaxBackground";
import { useTranslations } from "next-intl";

export default function AppHero() {
  const t = useTranslations("appHero");

  return (
    <ParallaxBackground
      backgroundImage="/hero-bg.webp"
      speed={-20}
      minHeight="400px"
      sectionName="home"
    >
      <h1 className="text-4xl font-bold mb-4 -mt-24 text-white">
        {t("title")}
      </h1>
      <p className="mb-6 text-white max-w-xl">{t("description")}</p>
    </ParallaxBackground>
  );
}
