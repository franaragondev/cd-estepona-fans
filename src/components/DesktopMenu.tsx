"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function DesktopMenu() {
  const t = useTranslations("menu");
  const locale = useLocale();
  const pathname = usePathname();

  const basePath = `/${locale}`;

  const mainLinks = [
    { href: `${basePath}`, label: t("home") },
    { href: `${basePath}/noticias`, label: t("news") },
    { href: `${basePath}/partidos`, label: t("matches") },
    { href: `${basePath}/galeria`, label: t("gallery") },
  ];

  const fansLinks = [
    { href: `${basePath}/tribuna`, label: t("tribuna") },
    // { href: `${basePath}/mvp`, label: t("mvp") },
    // { href: `${basePath}/directos`, label: t("live") },
  ];

  const isLinkActive = (href: string) =>
    href === basePath
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const isFansActive = fansLinks.some(({ href }) => isLinkActive(href));

  const [fansOpen, setFansOpen] = useState(false);
  const fansRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fansRef.current && !fansRef.current.contains(event.target as Node)) {
        setFansOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex gap-12 items-center relative">
      <div className="flex gap-6">
        {mainLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-gray-700 hover:text-black transition ${
              isLinkActive(href) ? "text-black font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        ))}

        <div className="relative" ref={fansRef}>
          <button
            onClick={() => setFansOpen((open) => !open)}
            className={`text-gray-700 hover:text-black transition flex items-center gap-1 ${
              isFansActive ? "text-black font-semibold" : ""
            }`}
            aria-haspopup="true"
            aria-expanded={fansOpen}
            type="button"
          >
            {t("fansSection")}
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                fansOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {fansOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded shadow-lg z-50">
              {fansLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 transition ${
                    isLinkActive(href) ? "font-semibold bg-gray-100" : ""
                  }`}
                  onClick={() => setFansOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DesktopMenu;
