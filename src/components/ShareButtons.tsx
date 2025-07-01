"use client";

import { Facebook, Twitter, Link as LinkIcon } from "lucide-react";

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
    } catch {}
  };

  const handleFacebookShare = () => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = window.location.href;

    const shareUrl = `https://www.facebook.com/dialog/share?app_id=${appId}&display=popup&href=${encodeURIComponent(
      url
    )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;

    window.open(twitterUrl, "_blank", "width=600,height=400");
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
    </>
  );
}
