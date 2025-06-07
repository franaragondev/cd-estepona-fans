"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("menu");
  const locale = useLocale();
  const pathname = usePathname();
  const basePath = `/${locale}`;

  // Split pathname by "/" and filter out empty strings
  // Example pathname: "/es/app/home"
  const parts = pathname?.split("/").filter(Boolean) || [];
  // parts = ["es", "app", "home"]

  // Check if second part is "app"
  const isInApp = parts[1] === "app";

  // If we are in /es/app but no subroute after, e.g. "/es/app", consider landing page inside app
  const isAppRoute = isInApp && parts.length > 2;

  useEffect(() => {
    if (isMenuOpen) {
      // Prevent scrolling when mobile menu is open
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className="p-4 bg-white text-black sticky top-0 z-50 shadow-md
             grid grid-cols-3 items-center md:px-12 md:grid-cols-[1fr_auto_1fr]"
      >
        {/* Mobile hamburger menu button */}
        <div className="flex items-center md:hidden justify-start">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            className="ml-0 mt-1"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center md:justify-start items-center">
          <Image
            src="/logo-simple.webp"
            alt="Home Stocker Logo"
            width={40}
            height={40}
          />
        </div>

        {/* Desktop menu centered */}
        <div className="hidden md:flex justify-center">
          <DesktopMenu isAppRoute={isAppRoute} />
        </div>

        {/* User dropdown on the right side */}
        <div className="hidden md:flex justify-end items-center">
          {!isInApp && (
            <Link
              href={`${basePath}/app/home`}
              className="px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200"
            >
              {t("enterApp")}
            </Link>
          )}

          <UserDropdown />
        </div>

        <div className="flex justify-end md:hidden">
          {!isInApp && (
            <Link
              href={`${basePath}/app/home`}
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-2 rounded text-white bg-[#DC2C20]"
            >
              {t("enterApp")}
            </Link>
          )}
        </div>
      </header>

      {/* Mobile menu overlay */}
      <MobileMenu
        isAppRoute={isAppRoute}
        isOpen={isMenuOpen}
        onCloseAction={() => setIsMenuOpen(false)}
      />
    </>
  );
}
