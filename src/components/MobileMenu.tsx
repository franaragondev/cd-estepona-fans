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

  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("menu");
  const tLang = useTranslations("language");
  const basePath = `/${locale}`;

  function changeLocale(newLocale: string) {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    onCloseAction();
  }

  // Check login status on mount
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
            className="fixed top-16 left-0 h-[calc(100%-4rem)] w-54 bg-white dark:bg-gray-900 shadow-lg z-50 p-4 mt-4"
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
                className="text-gray-700 hover:text-black"
              >
                {t("home")}
              </Link>
              <Link
                href={`${basePath}/noticias`}
                onClick={onCloseAction}
                className="text-gray-700 hover:text-black"
              >
                {t("news")}
              </Link>
              <Link
                href={`${basePath}/partidos`}
                onClick={onCloseAction}
                className="text-gray-700 hover:text-black"
              >
                {t("matches")}
              </Link>
              <Link
                href={`${basePath}/galeria`}
                onClick={onCloseAction}
                className="text-gray-700 hover:text-black"
              >
                {t("gallery")}
              </Link>
              <Link
                href={`${basePath}/tribuna`}
                onClick={onCloseAction}
                className="text-gray-700 hover:text-black"
              >
                {t("tribuna")}
              </Link>
              <Link
                href={`${basePath}/directos`}
                onClick={onCloseAction}
                className="text-gray-700 hover:text-black"
              >
                {t("live")}
              </Link>
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
                  className="w-full inline-block px-4 py-2 rounded text-white bg-[#2f36a1] hover:bg-[#DC2C20] transition-colors duration-200 cursor-pointer"
                >
                  Panel de Administración
                </button>
                <button
                  onClick={() => {
                    fetch("/api/logout", { method: "POST" }).then(() => {
                      window.location.href = `/${locale}`;
                    });
                  }}
                  className="w-full inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer mt-5"
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
