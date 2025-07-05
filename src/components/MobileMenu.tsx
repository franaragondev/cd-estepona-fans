"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";

type MobileMenuProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

const locales = [
  { code: "es", key: "es" },
  { code: "en", key: "en" },
  { code: "fr", key: "fr" },
];

export default function MobileMenu({ isOpen, onCloseAction }: MobileMenuProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [fansOpen, setFansOpen] = useState(false);
  const [academyOpen, setAcademyOpen] = useState(false);

  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("menu");
  const tLang = useTranslations("language");
  const basePath = `/${locale}`;

  const isLinkActive = (href: string) =>
    href === basePath
      ? pathname === href
      : pathname === href || pathname.startsWith(href + "/");

  const fansLinks = [
    `${basePath}/tribuna`,
    // `${basePath}/mvp`,
    // `${basePath}/directos`,
  ];
  const academyLinks = [
    `${basePath}/cantera/noticias`,
    `${basePath}/cantera/galeria`,
  ];

  const isFansActive = fansLinks.some((href) => isLinkActive(href));
  const isAcademyActive = academyLinks.some((href) => isLinkActive(href));

  function changeLocale(newLocale: string) {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    onCloseAction();
  }

  useEffect(() => {
    async function checkLogin() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        setLoggedIn(data.loggedIn);
      } catch (error) {
        console.error("Failed to fetch session", error);
        setLoggedIn(false);
      }
    }
    checkLogin();
  }, []);

  const handleAdmin = () => {
    router.push(`/${locale}/admin`);
    onCloseAction();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-800/40 z-40"
          onClick={onCloseAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.aside
            className="fixed top-16 left-0 h-[calc(100%-4rem)] min-w-72 bg-white dark:bg-gray-900 shadow-lg z-50 p-4 mt-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "tween" }}
          >
            <nav className="flex flex-col space-y-4 mb-4">
              <Link
                href={`${basePath}`}
                onClick={onCloseAction}
                className={`text-gray-700 hover:text-black ${
                  isLinkActive(`${basePath}`) ? "text-black font-semibold" : ""
                }`}
              >
                {t("home")}
              </Link>
              <Link
                href={`${basePath}/noticias`}
                onClick={onCloseAction}
                className={`text-gray-700 hover:text-black ${
                  isLinkActive(`${basePath}/noticias`)
                    ? "text-black font-semibold"
                    : ""
                }`}
              >
                {t("news")}
              </Link>
              <Link
                href={`${basePath}/calendario`}
                onClick={onCloseAction}
                className={`text-gray-700 hover:text-black ${
                  isLinkActive(`${basePath}/calendario`)
                    ? "text-black font-semibold"
                    : ""
                }`}
              >
                {t("matches")}
              </Link>
              <Link
                href={`${basePath}/galeria`}
                onClick={onCloseAction}
                className={`text-gray-700 hover:text-black ${
                  isLinkActive(`${basePath}/galeria`)
                    ? "text-black font-semibold"
                    : ""
                }`}
              >
                {t("gallery")}
              </Link>

              {/* Academy dropdown */}
              <button
                onClick={() => setAcademyOpen((prev) => !prev)}
                className={`flex justify-between items-center text-gray-700 hover:text-black ${
                  isAcademyActive ? "text-black font-semibold" : ""
                }`}
              >
                {t("academySection")}
                <svg
                  className={`w-4 h-4 ml-2 transform transition-transform ${
                    academyOpen ? "rotate-180" : ""
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

              {academyOpen && (
                <div className="ml-4 flex flex-col space-y-2">
                  <Link
                    href={`${basePath}/cantera/noticias`}
                    onClick={onCloseAction}
                    className={`text-gray-700 hover:text-black ${
                      isLinkActive(`${basePath}/cantera/noticias`)
                        ? "text-black font-semibold"
                        : ""
                    }`}
                  >
                    {t("news")}
                  </Link>
                  <Link
                    href={`${basePath}/cantera/galeria`}
                    onClick={onCloseAction}
                    className={`text-gray-700 hover:text-black ${
                      isLinkActive(`${basePath}/cantera/galeria`)
                        ? "text-black font-semibold"
                        : ""
                    }`}
                  >
                    {t("gallery")}
                  </Link>
                </div>
              )}

              {/* Zona Fans */}
              <button
                onClick={() => setFansOpen((prev) => !prev)}
                className={`flex justify-between items-center text-gray-700 hover:text-black ${
                  isFansActive ? "text-black font-semibold" : ""
                }`}
              >
                {t("fansSection")}
                <svg
                  className={`w-4 h-4 ml-2 transform transition-transform ${
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
                <div className="ml-4 flex flex-col space-y-2">
                  <Link
                    href={`${basePath}/tribuna`}
                    onClick={onCloseAction}
                    className={`text-gray-700 hover:text-black ${
                      isLinkActive(`${basePath}/tribuna`)
                        ? "text-black font-semibold"
                        : ""
                    }`}
                  >
                    {t("tribuna")}
                  </Link>
                  {/* <Link
                    href={`${basePath}/mvp`}
                    onClick={onCloseAction}
                    className={`text-gray-700 hover:text-black ${
                      isLinkActive(`${basePath}/mvp`)
                        ? "text-black font-semibold"
                        : ""
                    }`}
                  >
                    {t("mvp")}
                  </Link> */}
                </div>
              )}
            </nav>

            <hr className="my-4 border-t border-gray-300 dark:border-gray-700" />

            <div className="mb-4">
              <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
                {t("language")}
              </h3>
              <ul>
                {locales.map(({ code, key }) => (
                  <li key={code}>
                    <button
                      onClick={() => changeLocale(code)}
                      disabled={code === locale}
                      className={`py-1 px-3 rounded text-gray-800 dark:text-gray-100 ${
                        code === locale
                          ? "font-semibold"
                          : "hover:bg-gray-200 dark:hover:bg-gray-800"
                      }`}
                    >
                      {tLang(key)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {loggedIn && (
              <div className="mt-4">
                <button
                  onClick={handleAdmin}
                  className="w-full px-4 py-2 rounded text-white bg-[#2f36a1] hover:bg-[#DC2C20] transition-colors duration-200"
                >
                  Panel de Administración
                </button>
                <button
                  onClick={() => {
                    fetch("/api/logout", { method: "POST" }).then(() => {
                      window.location.href = `/${locale}`;
                    });
                  }}
                  className="w-full px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 mt-5"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
