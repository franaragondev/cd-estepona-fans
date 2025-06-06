"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const pathname = usePathname();

  const isAuthPage =
    pathname?.includes("/auth/register") || pathname?.includes("/auth/login");

  return (
    <footer
      className={`text-center py-6 text-sm text-gray-500 ${
        isAuthPage ? "bg-gray-50" : "bg-white"
      }`}
    >
      &copy; {t("text")}
    </footer>
  );
}
