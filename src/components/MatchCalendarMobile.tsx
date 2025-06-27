"use client";

import React from "react";
import Image from "next/image";

interface Team {
  id: string;
  name: string;
  location: string;
  crestUrl: string;
}

interface Match {
  id: string;
  date: string;
  teamId: string;
  isHome: boolean;
  competition: string;
  score?: string;
  team: Team;
}

interface Props {
  matchesByDay: Record<number, Match[]>;
  year: number;
  month: number;
  locale: string;
}

function getResultColor(score: string | undefined, isHome: boolean) {
  if (!score) return "";

  const [homeScore, awayScore] = score.split(":").map(Number);

  const esteponaScore = isHome ? homeScore : awayScore;
  const opponentScore = isHome ? awayScore : homeScore;

  if (esteponaScore > opponentScore) return "text-green-600";
  if (esteponaScore === opponentScore) return "text-yellow-600";
  return "text-red-600";
}

function formatDate(year: number, month: number, day: number, locale: string) {
  const date = new Date(year, month, day);
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function MatchCalendarMobile({
  matchesByDay,
  year,
  month,
  locale,
}: Props) {
  const today = new Date();

  const sortedDays = Object.keys(matchesByDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="px-4 py-6 space-y-6">
      {sortedDays.length === 0 && (
        <p className="text-center text-gray-500">No hay partidos este mes.</p>
      )}

      {sortedDays.map((day) => {
        const dayMatches = matchesByDay[day];
        if (!dayMatches) return null;

        const isToday =
          year === today.getFullYear() &&
          month === today.getMonth() &&
          day === today.getDate();

        return (
          <section
            key={day}
            className={`border rounded-lg p-4 shadow-sm ${
              isToday ? "bg-blue-50 border-blue-400" : "bg-white"
            }`}
          >
            <h2 className="font-semibold mb-3 capitalize">
              {formatDate(year, month, day, locale)}
            </h2>

            <ul className="space-y-4">
              {dayMatches.map((match) => {
                const matchDate = new Date(match.date);
                const isPast = matchDate < today;

                const resultClass = isPast
                  ? getResultColor(match.score, match.isHome)
                  : "";

                return (
                  <li
                    key={match.id}
                    className={`flex items-center gap-3 p-2 rounded-md ${
                      isPast && !isToday
                        ? "border-2 border-gray-200"
                        : "animated-border"
                    }  hover:bg-gray-50`}
                  >
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={
                          match.isHome
                            ? "/teams/cdEstepona.webp"
                            : `/teams/${match.team.crestUrl}`
                        }
                        alt={match.isHome ? "CD ESTEPONA" : match.team.name}
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="32px"
                        loading="lazy"
                      />
                    </div>

                    <span className="font-semibold text-sm">vs</span>

                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image
                        src={
                          match.isHome
                            ? `/teams/${match.team.crestUrl}`
                            : "/teams/cdEstepona.webp"
                        }
                        alt={match.isHome ? match.team.name : "CD ESTEPONA"}
                        fill
                        style={{ objectFit: "contain" }}
                        sizes="32px"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex flex-col flex-grow text-xs md:text-sm min-w-0">
                      <span className="max-w-[120px] break-words block">
                        {match.isHome
                          ? "Estadio Francisco Muñoz Pérez"
                          : match.team.location}
                      </span>
                      <span className={`font-bold ${resultClass}`}>
                        {isPast && match.score !== undefined
                          ? match.score
                          : (() => {
                              const hours = matchDate.getHours();
                              const minutes = matchDate.getMinutes();
                              return hours === 0 && minutes === 0
                                ? "N/D"
                                : matchDate.toLocaleTimeString(locale, {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    timeZone: "Europe/Madrid",
                                  });
                            })()}

                        {isToday &&
                          !match.score &&
                          (() => {
                            const hours = matchDate.getHours();
                            const minutes = matchDate.getMinutes();
                            return hours === 0 && minutes === 0
                              ? "N/D"
                              : matchDate.toLocaleTimeString(locale, {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  timeZone: "Europe/Madrid",
                                });
                          })()}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
