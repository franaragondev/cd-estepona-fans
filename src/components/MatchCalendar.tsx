"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Match {
  id: string;
  competition: string;
  stadium?: string;
  location?: string;
  date: string;
  isHome: boolean;
  opponent: string;
  score?: string;
  opponentImage: string;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getResultColor(score: string, isHome: boolean) {
  const [homeScore, awayScore] = score.split("-").map(Number);

  const esteponaScore = isHome ? homeScore : awayScore;
  const opponentScore = isHome ? awayScore : homeScore;

  if (esteponaScore > opponentScore) return "bg-green-200";
  if (esteponaScore === opponentScore) return "bg-yellow-200";
  return "bg-red-200";
}

export default function Page() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/matches/monthly?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, month]);

  const days = daysInMonth(year, month);

  const matchesByDay = matches.reduce((acc, match) => {
    const day = new Date(match.date).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  console.log(matches);

  return (
    <div className="px-4 py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Calendario de partidos</h1>

      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 border rounded cursor-pointer"
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear(year - 1);
            } else {
              setMonth(month - 1);
            }
          }}
        >
          Mes anterior
        </button>
        <div className="font-semibold">
          {new Date(year, month).toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          className="px-4 py-2 border rounded cursor-pointer"
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear(year + 1);
            } else {
              setMonth(month + 1);
            }
          }}
        >
          Mes siguiente
        </button>
      </div>

      {loading ? (
        <p>Cargando partidos...</p>
      ) : (
        <div className="grid grid-cols-7 gap-2 text-center">
          {/* Header días semana */}
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d} className="font-semibold border-b pb-1">
              {d}
            </div>
          ))}

          {Array((new Date(year, month, 1).getDay() + 6) % 7)
            .fill(null)
            .map((_, i) => (
              <div key={"empty" + i} />
            ))}

          {/* Días del mes */}
          {Array(days)
            .fill(null)
            .map((_, i) => {
              const day = i + 1;
              const dayMatches = matchesByDay[day] || [];
              const today = new Date();
              const isPast =
                new Date(year, month, day) <
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  today.getDate()
                );

              return (
                <div
                  key={day}
                  className="border rounded p-1 flex flex-col items-center gap-1 min-h-[80px] text-xs"
                >
                  <div className="font-bold">{day}</div>

                  {dayMatches.map((match) => {
                    const matchDate = new Date(match.date);
                    const showResultColor = isPast && match.score !== undefined;
                    const resultClass =
                      showResultColor && match.score
                        ? getResultColor(match.score, match.isHome)
                        : "";

                    return (
                      <div
                        key={match.id}
                        className={`w-full rounded p-0.5 flex flex-col items-center gap-0.5 ${resultClass}`}
                      >
                        <div className="flex justify-center gap-1 items-center">
                          <Image
                            src={
                              match.isHome
                                ? "/logo-simple.webp"
                                : `/teams/${match.opponentImage}`
                            }
                            alt={`Logo de ${
                              match.isHome ? match.opponent : "CD ESTEPONA"
                            }`}
                            width={24}
                            height={24}
                            className="h-6 w-6 object-contain"
                            loading="lazy"
                          />
                          <span>vs</span>
                          <Image
                            src={
                              match.isHome
                                ? `/teams/${match.opponentImage}`
                                : "/logo-simple.webp"
                            }
                            alt={`Logo de ${
                              match.isHome ? "CD ESTEPONA" : match.opponent
                            }`}
                            width={24}
                            height={24}
                            className="h-6 w-6 object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-[9px]">{match.location}</div>
                        <div className="text-[9px]">
                          {isPast && match.score !== undefined
                            ? `${match.score}`
                            : matchDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
