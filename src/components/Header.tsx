"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import DesktopMenu from "./DesktopMenu";
import UserDropdown from "./UserDropdown";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            alt="CD Estepona Fans Logo"
            width={40}
            height={40}
          />
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
