"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import UserDropdown from "./UserDropdown";

type HeaderProps = {
  isAppRoute: boolean;
};

export default function Header({ isAppRoute }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isMenuOpen]);

  return (
    <>
      <header
        className="p-4 bg-white text-black sticky top-0 z-50 shadow-md
             grid grid-cols-3 items-center md:px-12 md:grid-cols-[1fr_auto_1fr]"
      >
        {/* Mobile Hamburger */}
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

        {/* Right side: UserDropdown */}
        <div className="hidden md:flex justify-end">
          <UserDropdown />
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
