"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export function DesktopMenu() {
  const t = useTranslations("menu");
  const locale = useLocale();

  const basePath = `/${locale}`;

  return (
    <nav className="flex gap-6">
      <Link
        href={`${basePath}/app/home`}
        className="text-gray-700 hover:text-black"
      >
        {t("home")}
      </Link>
      <Link
        href={`${basePath}/app/news`}
        className="text-gray-700 hover:text-black"
      >
        {t("news")}
      </Link>
      <Link
        href={`${basePath}/app/matches`}
        className="text-gray-700 hover:text-black"
      >
        {t("matches")}
      </Link>
      <Link
        href={`${basePath}/app/gallery`}
        className="text-gray-700 hover:text-black"
      >
        {t("gallery")}
      </Link>
      <Link
        href={`${basePath}/app/tribuna`}
        className="text-gray-700 hover:text-black"
      >
        {t("tribuna")}
      </Link>
    </nav>
  );
}

export default DesktopMenu;
