"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import UserDropdown from "./UserDropdown";
import { useLocale } from "next-intl";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale();
  const basePath = `/${locale}`;

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
        className="p-4 sticky top-0 z-50
             grid grid-cols-3 items-center md:px-12 md:grid-cols-[1fr_auto_1fr]
             bg-white/30 backdrop-blur-md border-b border-white/20 shadow-md"
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
          <Link key={`${basePath}`} href={`${basePath}`}>
            <Image
              src="/logo-simple.webp"
              alt="CD Estepona Fans Logo"
              width={40}
              height={40}
            />
          </Link>
        </div>

        {/* Desktop menu centered */}
        <div className="hidden md:flex justify-center">
          <DesktopMenu />
        </div>

        {/* User dropdown on the right side */}
        <div className="hidden md:flex justify-end items-center">
          <UserDropdown />
        </div>

        <div className="flex justify-end md:hidden"></div>
      </header>

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={isMenuOpen}
        onCloseAction={() => setIsMenuOpen(false)}
      />
    </>
  );
}
