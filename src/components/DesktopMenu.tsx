"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export function DesktopMenu() {
  const t = useTranslations("menu");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = `/${locale}`;

  const links = [
    { href: `${basePath}`, label: t("home") },
    { href: `${basePath}/noticias`, label: t("news") },
    { href: `${basePath}/partidos`, label: t("matches") },
    { href: `${basePath}/galeria`, label: t("gallery") },
    { href: `${basePath}/tribuna`, label: t("tribuna") },
  ];

  return (
    <nav className="flex gap-6">
      {links.map(({ href, label }) => {
        // Comprobar si el pathname actual coincide con el href (exacto o empieza con)
        const isActive =
          href === basePath
            ? pathname === href // Solo exacto para la home
            : pathname === href || pathname.startsWith(href + "/");

        return (
          <Link
            key={href}
            href={href}
            className={`text-gray-700 hover:text-black transition ${
              isActive ? "text-black font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default DesktopMenu;
