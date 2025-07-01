"use client";

import { Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ShareButtonsProps {
  url: string;
  title: string;
  label?: string;
}

export default function ShareButtons({
  url,
  title,
  label = "Compartir",
}: ShareButtonsProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado", { autoClose: 2000 });
    } catch {
      toast.error("Error al copiar el enlace");
    }
  };

  const openPopup = (shareUrl: string) => {
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleFacebookShare = () => {
    openPopup(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    );
  };

  const handleTwitterShare = () => {
    openPopup(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`
    );
  };

  return (
    <>
      <div className="flex justify-end items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">{label}</span>

        <button
          onClick={handleTwitterShare}
          title="Compartir en Twitter"
          className="hover:opacity-80 transition cursor-pointer"
        >
          <Twitter size={20} />
        </button>

        <button
          onClick={handleFacebookShare}
          title="Compartir en Facebook"
          className="hover:opacity-80 transition cursor-pointer"
        >
          <Facebook size={20} />
        </button>

        <button
          onClick={handleCopy}
          title="Copiar enlace"
          className="hover:opacity-80 transition cursor-pointer"
        >
          <LinkIcon size={20} />
        </button>
      </div>

      <ToastContainer position="bottom-center" />
    </>
  );
}
