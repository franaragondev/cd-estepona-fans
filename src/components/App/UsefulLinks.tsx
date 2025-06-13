"use client";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function UsefulLinks() {
  return (
    <section className="py-8 text-center">
      <div className="flex justify-center gap-8">
        <a
          href="https://www.facebook.com/people/CD-Estepona-Fans/61558523420705/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook del CD Estepona Fans"
          className="text-blue-600 hover:text-blue-800 text-3xl"
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.instagram.com/cdesteponafans/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram del CD Estepona Fans"
          className="text-pink-600 hover:text-pink-800 text-3xl"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.youtube.com/@CDEsteponaFans"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube del CD Estepona Fans"
          className="text-red-600 hover:text-red-800 text-3xl"
        >
          <FaYoutube />
        </a>
      </div>
    </section>
  );
}
