"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

type DesktopMenuProps = {
  isAppRoute: boolean;
};

export function DesktopMenu({ isAppRoute }: DesktopMenuProps) {
  const t = useTranslations("menu");
  const locale = useLocale();

  const basePath = `/${locale}`;

  return (
    <nav className="flex gap-6">
      {isAppRoute ? (
        <>
          <Link
            href={`${basePath}/app`}
            className="text-gray-700 hover:text-black"
          >
            {t("home")}
          </Link>
          <Link
            href={`${basePath}/app/pantry`}
            className="text-gray-700 hover:text-black"
          >
            Mi Despensa
          </Link>
          <Link
            href={`${basePath}/app/history`}
            className="text-gray-700 hover:text-black"
          >
            Historial / Consumo
          </Link>
          <Link
            href={`${basePath}/app/expirations`}
            className="text-gray-700 hover:text-black"
          >
            Próximas caducidades
          </Link>
        </>
      ) : (
        <>
          <Link
            href={`${basePath}#home`}
            className="text-gray-700 hover:text-black"
          >
            {t("home")}
          </Link>
          <Link
            href={`${basePath}#features`}
            className="text-gray-700 hover:text-black"
          >
            {t("features")}
          </Link>
          <Link
            href={`${basePath}#about`}
            className="text-gray-700 hover:text-black"
          >
            {t("about")}
          </Link>
          <Link
            href={`${basePath}#faq`}
            className="text-gray-700 hover:text-black"
          >
            {t("faq")}
          </Link>
          <Link
            href={`${basePath}#cta`}
            className="text-gray-700 hover:text-black"
          >
            {t("cta")}
          </Link>
        </>
      )}
    </nav>
  );
}

export default DesktopMenu;
