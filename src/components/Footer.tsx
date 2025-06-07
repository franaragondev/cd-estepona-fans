"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/auth/login");

  return (
    <footer
      className={`text-center py-6 text-sm text-gray-500 ${
        isAuthPage ? "bg-gray-50" : "bg-white"
      }`}
    >
      {t.rich("text", {
        link: (chunks) => (
          <a
            href="https://www.linkedin.com/in/fran-aragon-simon/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700"
          >
            {chunks}
          </a>
        ),
      })}
    </footer>
  );
}
