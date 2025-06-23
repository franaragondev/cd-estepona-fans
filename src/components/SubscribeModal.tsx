"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

import { useSubscribe } from "../hooks/useSubscribe";

export default function SubscribeModal() {
  const t = useTranslations("cta");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { email, setEmail, status, errorMessage, honeypotRef, handleSubmit } =
    useSubscribe(t);

  if (!isOpen) return null;

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };
  const modalVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
  };
  const messageVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        onClick={() => setIsOpen(false)}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(10px)",
        }}
      >
        <motion.div
          className="rounded-md max-w-2xl w-full p-6 relative bg-white"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer absolute top-2 right-4 text-black text-3xl font-bold hover:text-gray-300"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
          <div className="relative z-10 max-w-md mx-auto text-center text-black px-4 py-12">
            <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
            <p className="mb-6 text-gray-600">{t("description")}</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder={t("placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded-md border border-black text-black bg-transparent placeholder-black"
                autoComplete="off"
                required
                disabled={status === "loading"}
              />
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
                className="animated-border cursor-pointer bg-white text-black py-2 rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="text-green-600 text-sm mt-2"
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
