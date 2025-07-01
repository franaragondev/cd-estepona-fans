"use client";

import { useEffect, useState } from "react";
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
  const [fbSdkLoaded, setFbSdkLoaded] = useState(false);

  useEffect(() => {
    if (window.FB) {
      setFbSdkLoaded(true);
      return;
    }
    // Cargar el SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        xfbml: false,
        version: "v17.0",
      });
      setFbSdkLoaded(true);
    };

    // Insertar el script
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        setFbSdkLoaded(true);
        return;
      }
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode!.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

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
    if (fbSdkLoaded && window.FB) {
      window.FB.ui(
        {
          method: "share",
          href: url,
        },
        function (response: any) {
          if (response && !response.error_message) {
            toast.success("Compartido en Facebook!");
          } else if (response && response.error_message) {
            toast.error("Error al compartir en Facebook");
          }
        }
      );
    } else {
      openPopup(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`
      );
    }
  };

  return (
    <>
      <div className="flex justify-end items-center gap-3 mb-4">
        <span className="text-sm text-gray-600">{label}</span>

        <button
          onClick={() =>
            openPopup(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}&text=${encodeURIComponent(title)}`
            )
          }
          title="Compartir en Twitter"
          className="hover:opacity-80 transition cursor-pointer"
        >
          <Twitter size={20} />
        </button>

        <button
          onClick={handleFacebookShare}
          title="Compartir en Facebook"
          className="hover:opacity-80 transition cursor-pointer"
          disabled={!fbSdkLoaded}
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
