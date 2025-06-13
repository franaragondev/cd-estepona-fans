"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConfirmModal() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("confirmed") === "true") {
      setShowModal(true);
    }
  }, [searchParams]);

  if (!showModal) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>¡Gracias por confirmar tu suscripción!</h2>
        <button onClick={() => setShowModal(false)}>Cerrar</button>
      </div>

      <style jsx>{`
        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 400px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
