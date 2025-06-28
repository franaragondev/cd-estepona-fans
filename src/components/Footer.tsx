"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/auth/login");

  return (
    <footer
      className={`py-6 text-sm text-gray-500 ${
        isAuthPage ? "bg-gray-50" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between text-center sm:text-left gap-2">
        <span>{t("left")}</span>
        <span>
          {t.rich("right", {
            link: (chunks) => (
              <a
                href="https://franaragondev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                {chunks}
              </a>
            ),
          })}
        </span>
      </div>
    </footer>
  );
}
