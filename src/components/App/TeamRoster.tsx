// components/TeamRoster.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import classNames from "classnames";
import { PlayerWithStats } from "@/types";

type Props = {
  players: PlayerWithStats[];
};

export default function TeamRoster({ players }: Props) {
  const [activePlayerId, setActivePlayerId] = useState<string | null>(
    players[0]?.id ?? null
  );

  const activePlayer = players.find((p) => p.id === activePlayerId);

  return (
    <section className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Jugadores</h2>
        {/* Aquí puedes añadir el selector de equipo */}
      </div>

      {/* Carrusel */}
      <div className="flex overflow-x-auto gap-4 px-4 mb-8">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setActivePlayerId(player.id)}
          >
            <div
              className={classNames(
                "rounded-full overflow-hidden w-20 h-20 border-4 transition-all",
                {
                  "border-red-600": activePlayerId === player.id,
                  "border-transparent": activePlayerId !== player.id,
                }
              )}
            >
              <Image
                src={player.photo ?? "/default-player.jpg"}
                alt={player.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>
            <p className="text-sm mt-2 text-center">
              {player.preferredName || player.name}
            </p>
          </div>
        ))}
      </div>

      {/* Detalle del jugador seleccionado */}
      {activePlayer && (
        <div className="bg-gray-100 px-4 py-8 rounded-lg max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
            {/* Foto grande */}
            <div className="relative">
              <Image
                src={activePlayer.photo ?? "/default-player.jpg"}
                alt={activePlayer.name}
                width={200}
                height={200}
                className="object-cover rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -left-4 -top-4 text-4xl font-bold text-red-600">
                {activePlayer.number}
              </div>
            </div>

            {/* Datos del jugador */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold uppercase text-gray-800">
                {activePlayer.position}
              </h3>
              <h4 className="text-2xl font-bold text-black mb-4">
                {activePlayer.preferredName || activePlayer.name}
              </h4>
              <div className="flex gap-6 justify-center md:justify-start">
                <div>
                  <p className="text-gray-500 text-sm">Partidos</p>
                  <p className="text-lg font-bold">
                    {activePlayer.stats[0]?.matches ?? 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Minutos</p>
                  <p className="text-lg font-bold">
                    {activePlayer.stats[0]?.minutes ?? 0}
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
