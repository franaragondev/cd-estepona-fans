"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import ParallaxBackground from "./ParallaxBackground";
import { useSubscribe } from "../hooks/useSubscribe";
import Button from "./Button";

export default function CallToAction() {
  const t = useTranslations("cta");
  const router = useRouter();

  const { status } = useSubscribe(t);

  const handleClick = () => {
    router.push("/auth/login");
  };

  return (
    <ParallaxBackground
      backgroundImage="/CallToAction-bg.webp"
      speed={-20}
      minHeight="400px"
      sectionName="cta"
    >
      <div className="relative z-10 max-w-md mx-auto text-center text-white px-4 py-12 -mt-24">
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
        <p className="mb-6 text-gray-300">{t("description")}</p>
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleClick}
            type="submit"
            loading={status === "loading"}
            disabled={status === "loading"}
          >
            {t("loginOrRegisterButton")}
          </Button>
        </div>
      </div>
    </ParallaxBackground>
  );
}
