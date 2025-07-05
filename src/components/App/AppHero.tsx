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
      priority={true}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 -mt-24 md:w-[50vw] bg-gradient-to-r from-[#ff5c50] to-[#6c73ff] bg-clip-text text-transparent drop-shadow-lg">
          {t("title")}
        </h1>
        <p className="md:text-[20px] mb-6 text-white max-w-xl md:w-[50vw]">
          {t("description")}
        </p>
      </div>
    </ParallaxBackground>
  );
}
