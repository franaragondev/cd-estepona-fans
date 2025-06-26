import React from "react";

export function linkify(text: string): React.ReactNode {
  const urlRegex = /https?:\/\/[^\s]+/g;

  const urls = text.match(urlRegex) || [];
  const parts = text.split(urlRegex);

  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    elements.push(part);
    if (index < urls.length) {
      const link = urls[index];
      elements.push(
        <a
          key={`link-${index}`}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {link}
        </a>
      );
    }
  });

  return elements;
}
