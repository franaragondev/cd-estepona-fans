"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmModal() {
  const searchParams = useSearchParams();
  const router = useRouter(); // <--- aquí
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("confirmed") === "true") {
      setShowModal(true);
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

  // Función que cierra modal y redirige a /
  const handleClose = () => {
    setShowModal(false);
    router.push("/"); // redirige a la raíz
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal={true}
      aria-labelledby="modalTitle"
    >
      <div className="modal-content" tabIndex={-1}>
        <h2 id="modalTitle">Gracias por confirmar tu suscripción</h2>
        <p>Tu suscripción ha sido confirmada exitosamente.</p>
        <button onClick={handleClose} aria-label="Cerrar modal">
          Cerrar
        </button>
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
