"use client";

import { useTranslations } from "next-intl";
import ParallaxBackground from "./ParallaxBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscribe } from "../hooks/useSubscribe";

export default function Hero() {
  const t = useTranslations("hero");

  const { email, setEmail, status, errorMessage, honeypotRef, handleSubmit } =
    useSubscribe(t);

  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <ParallaxBackground
      backgroundImage="/hero-bg.webp"
      speed={-20}
      minHeight="400px"
      sectionName="home"
    >
      <h1 className="text-3xl font-bold mb-4 -mt-24">{t("title")}</h1>
      <p className="mb-6">{t("description")}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder={t("placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 text-white bg-transparent placeholder-white"
          autoComplete="off"
        />

        {/* Honeypot anti-bot field */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-5000px" }}
        >
          <input
            type="text"
            name="honeypot"
            tabIndex={-1}
            defaultValue=""
            autoComplete="off"
            ref={honeypotRef}
          />
        </div>

        <button
          type="submit"
          name="subscribe"
          className="bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200 flex items-center justify-center gap-2"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <svg
              className="animate-spin h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            t("button")
          )}
        </button>

        <AnimatePresence>
          {status === "success" && (
            <motion.p
              className="text-green-400 text-sm mt-2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={messageVariants}
              key="success"
            >
              {t("successMessage")}
            </motion.p>
          )}

          {(status === "error" ||
            status === "bot" ||
            status === "invalid_email" ||
            status === "email_deleted" ||
            status === "server_error") && (
            <motion.p
              className="text-red-400 text-sm mt-2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={messageVariants}
              key="error"
            >
              {errorMessage || t("errorMessage")}
            </motion.p>
          )}
        </AnimatePresence>
      </form>
    </ParallaxBackground>
  );
}
