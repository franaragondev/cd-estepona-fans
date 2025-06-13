"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmModal() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados para controlar modal y mensajes
  const [showModal, setShowModal] = useState(false);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const confirmed = searchParams.get("confirmed");
    const token = searchParams.get("token");

    if (confirmed === "true") {
      // Caso actual: solo mostrar modal de éxito simple
      setMessageTitle("Gracias por confirmar tu suscripción");
      setMessageBody("Tu suscripción ha sido confirmada exitosamente.");
      setShowModal(true);
      setLoading(false);
    } else if (token) {
      // Nuevo caso: tenemos token, llamar a API para validar
      setLoading(true);
      fetch(`https://www.cdesteponafans.com/api/confirm?token=${token}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Error desconocido");
          // Éxito
          setMessageTitle("Gracias por confirmar tu suscripción");
          setMessageBody("Tu suscripción ha sido confirmada exitosamente.");
          setShowModal(true);
        })
        .catch((error) => {
          // Error token inválido o expirado
          setMessageTitle("Error al confirmar");
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

    // Construir la URL sin 'confirmed' ni 'token'
    const url = new URL(window.location.href);
    url.searchParams.delete("confirmed");
    url.searchParams.delete("token");

    // Actualizar la URL sin recargar ni añadir entrada al historial
    router.replace(url.pathname + url.search);
  };

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal={true}
      aria-labelledby="modalTitle"
      onClick={handleClose} // cerrar modal al clicar fuera del contenido
    >
      <div
        className="modal-content"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()} // evitar cerrar modal si clicas dentro
      >
        {loading ? (
          <p>Confirmando...</p>
        ) : (
          <>
            <h2 id="modalTitle">{messageTitle}</h2>
            <p>{messageBody}</p>
            <button onClick={handleClose} aria-label="Cerrar modal">
              Cerrar
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
