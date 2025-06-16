import React from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cerrar",
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300  cursor-pointer"
            onClick={onClose}
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
