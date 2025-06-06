"use client";

import { useTranslations } from "next-intl";
import ParallaxBackground from "./ParallaxBackground";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function Hero() {
  const t = useTranslations("hero");
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/login");
  };

  return (
    <ParallaxBackground
      backgroundImage="/hero-bg.webp"
      speed={-20}
      minHeight="400px"
      sectionName="home"
    >
      <h1 className="text-3xl font-bold mb-4 -mt-24">{t("title")}</h1>
      <p className="mb-6">{t("description")}</p>

      <div className="flex flex-col gap-2">
        <Button onClick={handleClick}>{t("loginOrRegisterButton")}</Button>
      </div>
    </ParallaxBackground>
  );
}
