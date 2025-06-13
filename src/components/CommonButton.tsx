"use client";

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

interface NewsButtonProps {
  href: string;
  className?: string;
  translation: string;
  buttonTitle: string;
}

const NewsButton: React.FC<NewsButtonProps> = ({
  href,
  className,
  translation,
  buttonTitle,
}) => {
  const t = useTranslations(translation);
  return (
    <Link href={href} className={className}>
      {t(buttonTitle)}
    </Link>
  );
};

export default NewsButton;
