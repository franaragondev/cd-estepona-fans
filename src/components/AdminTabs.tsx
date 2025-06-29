"use client";

import { useState } from "react";
import NewsAdmin from "@/components/NewsAdmin";
import GalleryAdmin from "@/components/GalleryAdmin";
import MatchesAdmin from "@/components/MatchesAdmin";

type Props = {
  userName: string;
  userId: string;
};

export default function AdminTabs({ userName, userId }: Props) {
  const [activeTab, setActiveTab] = useState<"news" | "gallery" | "matches">(
    "news"
  );

  const tabs = [
    { key: "news", label: "Noticias" },
    { key: "gallery", label: "Galería" },
    { key: "matches", label: "Partidos" },
  ] as const;

  const getTabClass = (key: string) =>
    `text-sm sm:text-base px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      activeTab === key
        ? "bg-indigo-600 text-white shadow"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  const renderContent = () => {
    switch (activeTab) {
      case "news":
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Noticias
            </h2>
            <NewsAdmin name={userName} id={userId} />
          </>
        );
      case "gallery":
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Galería
            </h2>
            <GalleryAdmin />
          </>
        );
      case "matches":
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
              Partidos
            </h2>
            <MatchesAdmin />
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="md:hidden flex justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={getTabClass(tab.key)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="md:hidden bg-white rounded-lg shadow p-6">
        {renderContent()}
      </div>

      <div className="hidden md:grid md:grid-cols-3 md:gap-8">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            Noticias
          </h2>
          <NewsAdmin name={userName} id={userId} />
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            Galería
          </h2>
          <GalleryAdmin />
        </div>
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-700">
            Partidos
          </h2>
          <MatchesAdmin />
        </div>
      </div>
    </div>
  );
}
