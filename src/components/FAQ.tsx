"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import reactStringReplace from "react-string-replace";
import { langMap } from "@/lib/langMap";

export default function FAQ() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const faq: { q: string; a: string }[] = t.raw("questions");

  const faqSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: langMap[locale] || "es",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    };
  }, [faq, locale]);

  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [faqSchema]);

  function renderAnswer(text: string) {
    return reactStringReplace(text, /<link>(.*?)<\/link>/g, (match, i) => (
      <a
        key={`link-${i}`}
        href="https://www.linkedin.com/in/fran-aragon-simon/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "inherit",
          textDecoration: "underline",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {match}
      </a>
    ));
  }

  return (
    <section id="faq" className="max-w-2xl mx-auto my-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">{t("title")}</h2>
      <Accordion type="single" collapsible>
        {faq.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-b"
          >
            <AccordionTrigger className="text-left text-lg font-medium py-4">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-gray-700">
              {renderAnswer(item.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
