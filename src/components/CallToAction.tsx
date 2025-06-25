"use client";

import { useTranslations } from "next-intl";
import ParallaxBackground from "./ParallaxBackground";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscribe } from "../hooks/useSubscribe";

export default function CallToAction() {
  const t = useTranslations("cta");

  const { email, setEmail, status, errorMessage, honeypotRef, handleSubmit } =
    useSubscribe(t);

  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <ParallaxBackground
      backgroundImage="/CallToAction-bg.webp"
      speed={-20}
      minHeight="400px"
      sectionName="cta"
    >
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 py-12 min-h-[400px] -mt-20">
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
        <p className="mb-6 text-gray-300">{t("description")}</p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-md items-stretch"
        >
          <input
            type="email"
            placeholder={t("placeholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-white text-white bg-transparent placeholder-white"
            autoComplete="off"
            required
            disabled={status === "loading"}
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
              autoComplete="off"
              ref={honeypotRef}
              defaultValue=""
            />
          </div>

          <button
            className="w-full bg-white text-black py-2 rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <div className="flex justify-center items-center">
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
              </div>
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
            {["error", "bot", "invalid_email", "server_error"].includes(
              status
            ) && (
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
      </div>
    </ParallaxBackground>
  );
}
