"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import classNames from "classnames";
import { motion } from "framer-motion";
import { PlayerWithStats } from "@/types";

type Props = {
  players: PlayerWithStats[];
};

export default function TeamRoster({ players }: Props) {
  const [selectedTeamId, setSelectedTeamId] = useState<1 | 2>(1);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [hoveredPlayerId, setHoveredPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const firstPlayer = players.find(
      (p) => p.teamId === selectedTeamId && p.position.toLowerCase() !== "staff"
    );
    setActivePlayerId(firstPlayer?.id ?? null);
  }, [selectedTeamId, players]);

  const positionOrder: Record<string, number> = {
    portero: 0,
    defensa: 1,
    medio: 2,
    delantero: 3,
  };

  const filteredPlayers = players
    .filter(
      (p) => p.teamId === selectedTeamId && p.position.toLowerCase() !== "staff"
    )
    .sort((a, b) => {
      const posA = positionOrder[a.position.toLowerCase()] ?? 99;
      const posB = positionOrder[b.position.toLowerCase()] ?? 99;
      return posA - posB;
    });

  const activePlayer = filteredPlayers.find((p) => p.id === activePlayerId);

  const strokeWidth = 2;
  const circleRadius = 47;
  const circumference = 2 * Math.PI * circleRadius;
  const startOffset = circumference * 0.75;

  return (
    <section className="w-full">
      <div className="text-center mb-6">
        <h2 className="sr-only">JUGADORES</h2>
        <div className="flex justify-center gap-4 ">
          <button
            className={classNames(
              "px-4 py-2 rounded border transition-colors cursor-pointer",
              selectedTeamId === 1
                ? "bg-red-600 text-white border-red-600"
                : "border-gray-300 hover:bg-gray-200"
            )}
            onClick={() => setSelectedTeamId(1)}
          >
            Primer Equipo
          </button>
          <button
            className={classNames(
              "px-4 py-2 rounded border transition-colors cursor-pointer",
              selectedTeamId === 2
                ? "bg-red-600 text-white border-red-600"
                : "border-gray-300 hover:bg-gray-200"
            )}
            onClick={() => setSelectedTeamId(2)}
          >
            Cantera
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-4 px-4 pb-6 mb-8 mt-12 custom-scrollbar">
        {filteredPlayers.map((player) => {
          const isActive = activePlayerId === player.id;
          const isHovered = hoveredPlayerId === player.id;
          const showBorder = isActive || isHovered;

          return (
            <div
              key={player.id}
              className="flex flex-col items-center cursor-pointer mr-2 ml-2"
              onClick={() => setActivePlayerId(player.id)}
              onMouseEnter={() => setHoveredPlayerId(player.id)}
              onMouseLeave={() => setHoveredPlayerId(null)}
            >
              <div className="relative w-23 h-23" style={{ top: 2 }}>
                <Image
                  src={player.photo ?? "/default-player.jpg"}
                  alt={player.name}
                  width={80}
                  height={80}
                  className="object-cover object-top rounded-full w-23 h-23"
                />
                {showBorder && (
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    width={circleRadius * 2 + strokeWidth * 2}
                    height={circleRadius * 2 + strokeWidth * 2}
                    viewBox={`0 0 ${circleRadius * 2 + strokeWidth * 2} ${
                      circleRadius * 2 + strokeWidth * 2
                    }`}
                    fill="none"
                  >
                    <motion.circle
                      key={`${player.id}-${showBorder}`}
                      cx={circleRadius + strokeWidth}
                      cy={circleRadius + strokeWidth}
                      r={circleRadius}
                      stroke="#1774cb"
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={startOffset}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                      }}
                    />
                  </svg>
                )}
              </div>
              <p className="text-sm mt-2 text-center">
                {player.preferredName || player.name}
              </p>
            </div>
          );
        })}
      </div>

      {activePlayer && (
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            <div className="relative w-max">
              <div
                className="absolute -left-16 top-9 text-9xl font-bold text-[#DC2C20]"
                style={{
                  transform: "skewX(-10deg)",
                  zIndex: 0,
                  opacity: 0.5,
                }}
              >
                {activePlayer.number}
              </div>

              <Image
                src={activePlayer.photo ?? "/default-player.jpg"}
                alt={activePlayer.name}
                width={230}
                height={230}
                className="object-cover mt-0 rounded-md relative z-10"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 98%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 98%)",
                }}
              />

              <div className="absolute bottom-11 left-0 right-0 z-20 h-15 flex items-center justify-between flex-col">
                <h4 className="bottom-4 left-0 right-0 text-white text-5xl text-center font-montserrat">
                  {activePlayer.name}
                </h4>
                <h3 className="text-lg font-light uppercase text-gray-400 pt-2 italic">
                  {activePlayer.position}
                </h3>
              </div>
            </div>

            <div className="text-center md:text-left mt-10">
              <div className="flex gap-6 justify-center md:justify-start">
                <div className="mr-3">
                  <p className="text-4xl font-light">
                    {activePlayer.stats[0]?.matches ?? 0}
                  </p>
                  <p className="text-gray-500 text-md">
                    Partidos <br /> Jugados
                  </p>
                </div>
                <div>
                  {" "}
                  <p className="text-4xl font-light">
                    {activePlayer.stats[0]?.minutes ?? 0}
                  </p>
                  <p className="text-gray-500 text-md">
                    Minutos <br /> Jugados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
