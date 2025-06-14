"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ConfirmModal() {
  const t = useTranslations("confirmEmailModal");
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const token = searchParams.get("token");

    if (confirmed === "true") {
      setMessageTitle(t("title"));
      setMessageBody(t("description"));
      setShowModal(true);
      setLoading(false);
    } else if (token) {
      setLoading(true);
      fetch(`https://www.cdesteponafans.com/api/confirm?token=${token}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || t("unknownError"));
          setMessageTitle(t("title"));
          setMessageBody(t("description"));
          setShowModal(true);
        })
        .catch((error) => {
          setMessageTitle(t("errorConfirming"));
          setMessageBody(error.message);
          setShowModal(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams]);

  useEffect(() => {
    if (showModal) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [showModal]);

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);

    const url = new URL(window.location.href);
    url.searchParams.delete("confirmed");
    url.searchParams.delete("token");

    router.replace(url.pathname + url.search);
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal={true}
      aria-labelledby="modalTitle"
      onClick={handleClose}
    >
      <div
        className="modal-content"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div
              className="w-12 h-12 rounded-full animate-spin"
              style={{
                background:
                  "conic-gradient(from 45deg, #DC2C20, #DC2C20, #2f36a1, #2f36a1, transparent 270deg 360deg)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
              }}
            />
          </div>
        ) : (
          <>
            <h2 id="modalTitle">{messageTitle}</h2>
            <p>{messageBody}</p>
            <button onClick={handleClose} aria-label="Cerrar modal">
              {t("button")}
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(10px);
          animation: fadeIn 0.25s ease forwards;
        }

        .modal-content {
          background: #fefefe;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          max-width: 440px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
          color: #222;
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          text-align: center;
          animation: slideIn 0.25s ease forwards;
          outline: none;
        }

        h2 {
          margin-bottom: 0.5rem;
          font-weight: 700;
          font-size: 1.5rem;
          color: #111;
        }

        p {
          font-size: 1rem;
          color: #555;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }

        button {
          background: #333;
          color: #f5f5f7;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          border-radius: 6px;
          padding: 0.65rem 1.8rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          box-shadow: 0 4px 8px rgba(51, 51, 51, 0.2);
        }

        button:hover {
          background-color: #555;
          box-shadow: 0 6px 12px rgba(85, 85, 85, 0.3);
        }

        button:focus {
          outline: 3px solid #999;
          outline-offset: 2px;
        }

        @keyframes fadeIn {
          from {
            background: rgba(0, 0, 0, 0);
          }
          to {
            background: rgba(0, 0, 0, 0.6);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
