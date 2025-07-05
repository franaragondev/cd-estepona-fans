"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import ReactCountryFlag from "react-country-flag";

type MVPPlayer = {
  id: string;
  name: string;
  photo: string;
  mvps: number;
};

type PlayerBasic = {
  id: string;
  name: string;
  photo?: string | null;
  position: string;
  number: number;
  nationality: string;
};

type PlayerWithMVP = PlayerBasic & { mvps: number; countryCode?: string };

function getPlayerPhoto(photo?: string | null): string {
  return photo && photo.trim() !== "" ? photo : "/default-player.jpg";
}

const countryNameToCode: Record<string, string> = {
  Española: "ES",
  Costamarfileño: "CI",
};

export default function MVPPage() {
  const t = useTranslations("mvp");
  const [podium, setPodium] = useState<MVPPlayer[]>([]);
  const [playersByPosition, setPlayersByPosition] = useState<
    Record<string, PlayerWithMVP[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const mvpRes = await fetch("/api/mvp");
        const mvpData = await mvpRes.json();

        const playersRes = await fetch("/api/players");
        const playersData: PlayerBasic[] = await playersRes.json();

        const mvpMap = new Map<string, number>();
        [...mvpData.top3, ...mvpData.others].forEach((p: MVPPlayer) => {
          mvpMap.set(p.id, p.mvps);
        });

        // Podium
        const podiumPlayers: MVPPlayer[] = mvpData.top3.slice(0, 3);
        while (podiumPlayers.length < 3) {
          podiumPlayers.push({
            id: `empty-${podiumPlayers.length}`,
            name: "-",
            photo: "/default-player.jpg",
            mvps: 0,
          });
        }
        setPodium(podiumPlayers);

        const grouped: Record<string, PlayerWithMVP[]> = {};
        for (const player of playersData) {
          const position = player.position;
          if (!grouped[position]) {
            grouped[position] = [];
          }
          grouped[position].push({
            ...player,
            photo: player.photo ?? "/default-player.jpg",
            mvps: mvpMap.get(player.id) ?? 0,
            countryCode: countryNameToCode[player.nationality] ?? undefined,
          });
        }

        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((a, b) => a.name.localeCompare(b.name));
        });

        setPlayersByPosition(grouped);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const orderedPositions = [
    "Portero",
    "Defensa",
    "Centrocampista",
    "Delantero",
  ];

  if (loading) {
    return (
      <main className="relative flex items-center justify-center py-16 min-h-[85vh]">
        <div className="absolute inset-0 flex items-center justify-center z-10 -mt-20">
          <div
            className="w-12 h-12 rounded-full animate-spin"
            style={{
              background:
                "conic-gradient(from 45deg, #DC2C20, #DC2C20, #2f36a1, #2f36a1, transparent 270deg 360deg)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 5px))",
            }}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 max-w-6xl mx-auto space-y-14 min-h-[85vh]">
      <section className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
      </section>
      <p className="text-gray-600 mb-6">{t("description")}</p>

      {/* Podium */}
      <section>
        <div
          className="flex justify-center items-end gap-6"
          style={{ height: `${5 * 34 + 300}px` }}
        >
          {/* Silver */}
          <div className="flex flex-col items-center w-24">
            <Image
              src={getPlayerPhoto(podium[1].photo)}
              alt={podium[1].name}
              width={48}
              height={48}
              className="rounded-full object-cover mb-2 shadow-md border-2 border-gray-300"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: podium[1].mvps * 5 + 100 }}
              transition={{ duration: 1 }}
              className="w-full bg-gray-400 rounded-t-lg flex justify-center items-end shadow-md"
            >
              <p className="text-white font-semibold mb-2">{podium[1].mvps}</p>
            </motion.div>
            <p className="mt-2 text-sm font-semibold text-center">
              {podium[1].name}
            </p>
            <p className="text-xs text-gray-500">{t("positions.second")}</p>
          </div>

          {/* Gold */}
          <div className="flex flex-col items-center w-24">
            <Image
              src={getPlayerPhoto(podium[0].photo)}
              alt={podium[0].name}
              width={48}
              height={48}
              className="rounded-full object-cover mb-2 shadow-md border-2 border-yellow-400"
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: podium[0].mvps * 5 + 160 }}
              transition={{ duration: 1 }}
              className="w-full bg-yellow-400 rounded-t-lg flex justify-center items-end shadow-lg"
            >
              <p className="text-white font-bold mb-2">{podium[0].mvps}</p>
            </motion.div>
            <p className="mt-2 text-sm font-semibold text-center">
              {podium[0].name}
            </p>
            <p className="text-xs text-gray-500">{t("positions.first")}</p>
          </div>

          {/* Bronze */}
          <div className="flex flex-col items-center w-24">
            <Image
              src={getPlayerPhoto(podium[2].photo)}
              alt={podium[2].name}
              width={48}
              height={48}
              className="rounded-full object-cover mb-2 shadow-md border-2"
              style={{ borderColor: "#b87333" }}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: podium[2].mvps * 5 + 80 }}
              transition={{ duration: 1 }}
              className="w-full rounded-t-lg flex justify-center items-end shadow-md"
              style={{ backgroundColor: "#b87333" }}
            >
              <p className="text-white font-semibold mb-2">{podium[2].mvps}</p>
            </motion.div>
            <p className="mt-2 text-sm font-semibold text-center">
              {podium[2].name}
            </p>
            <p className="text-xs text-gray-500">{t("positions.third")}</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-10">
        <h2 className="text-lg font-semibold text-blue-900 mb-1">
          {t("howToVoteTitle")}
        </h2>
        <p className="text-sm text-blue-800">
          {t("howToVoteText")}{" "}
          <a
            href="https://www.facebook.com/groups/679758290735773"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-blue-900"
          >
            Facebook
          </a>
          .
        </p>
      </section>

      {/* Full player list grouped by position */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          {t("allPlayers") ?? "Full Squad"}
        </h2>

        {orderedPositions.map((pos) => {
          const group = playersByPosition[pos];
          if (!group || group.length === 0) return null;

          return (
            <div key={pos} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t(`positionsByRole.${pos}`)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm"
                  >
                    <div
                      className="relative shrink-0"
                      style={{ width: 60, height: 62 }}
                    >
                      <div
                        className="rounded-full overflow-hidden w-52 h-52 border-1"
                        style={{ width: 50, height: 62 }}
                      >
                        <Image
                          src={getPlayerPhoto(player.photo)}
                          alt={player.name}
                          width={48}
                          height={48}
                          className="object-cover object-top"
                        />
                      </div>
                      <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[12px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10"
                        style={{ marginLeft: "-0.3rem" }}
                      >
                        {player.number}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{player.name}</p>
                        {player.countryCode && (
                          <ReactCountryFlag
                            countryCode={player.countryCode}
                            svg
                            style={{
                              width: 20,
                              height: 15,
                              borderRadius: 2,
                              boxShadow: "0 0 1px rgba(0,0,0,0.2)",
                            }}
                            title={player.nationality}
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{player.mvps} MVP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
