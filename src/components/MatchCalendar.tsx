"use client";

import React from "react";
import Image from "next/image";
import { toZonedTime } from "date-fns-tz";

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

function getResultColor(score: string | null | undefined, isHome: boolean) {
  if (!score) return "";

  const [homeScore, awayScore] = score.split(":").map(Number);
  const esteponaScore = isHome ? homeScore : awayScore;
  const opponentScore = isHome ? awayScore : homeScore;

  if (esteponaScore > opponentScore) return "bg-green-200";
  if (esteponaScore === opponentScore) return "bg-yellow-200";
  return "bg-red-200";
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function MatchCalendar({
  matchesByDay,
  year,
  month,
  locale,
}: Props) {
  const days = daysInMonth(year, month);
  const today = new Date();

  const weekDayNames = Array.from({ length: 7 }, (_, i) =>
    new Date(2021, 10, 1 + i).toLocaleDateString(locale, { weekday: "short" })
  );

  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      {/* weekday header */}
      {weekDayNames.map((day, i) => (
        <div key={i} className="font-semibold border-b pb-1 capitalize">
          {day}
        </div>
      ))}

      {/* empty cells before first day */}
      {Array((new Date(year, month, 1).getDay() + 6) % 7)
        .fill(null)
        .map((_, i) => (
          <div key={"empty" + i} />
        ))}

      {/* month day cells */}
      {Array(days)
        .fill(null)
        .map((_, i) => {
          const day = i + 1;
          const dayMatches = matchesByDay[day] || [];

          const dayDate = new Date(Date.UTC(year, month, day));
          const dayDateMadrid = toZonedTime(dayDate, "Europe/Madrid");

          const isPast =
            dayDateMadrid <
            new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isToday =
            dayDateMadrid.getFullYear() === today.getFullYear() &&
            dayDateMadrid.getMonth() === today.getMonth() &&
            dayDateMadrid.getDate() === today.getDate();

          const matchWithResult = dayMatches.find((m) => m.score !== undefined);

          const resultClass = (() => {
            if (!isPast) return "";
            return matchWithResult
              ? getResultColor(matchWithResult.score!, matchWithResult.isHome)
              : "";
          })();

          const pastNoResultClass =
            isPast && !matchWithResult
              ? "bg-gray-100 text-gray-400 line-through"
              : "";

          const isFutureWithMatch =
            dayDateMadrid >
              new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              ) && dayMatches.length > 0;

          const hasAnimatedBorder =
            isFutureWithMatch || (isToday && dayMatches.length > 0)
              ? "animated-border"
              : "";

          return (
            <div
              key={day}
              className={`${
                hasAnimatedBorder ? "" : "border"
              } rounded p-1 flex flex-col items-center gap-1 min-h-[80px] text-xs relative ${
                isToday ? "bg-blue-50" : ""
              }${
                isToday && dayMatches.length === 0 ? " ring ring-blue-400" : ""
              } ${resultClass} ${pastNoResultClass} ${hasAnimatedBorder}`}
            >
              <div className="font-bold">{day}</div>
              {dayMatches.map((match) => {
                const matchDate = toZonedTime(match.date, "Europe/Madrid");

                return (
                  <div
                    key={match.id}
                    className="w-full rounded p-0.5 flex flex-col items-center gap-0.5 z-20"
                  >
                    <div className="flex justify-center gap-1 items-center">
                      <div className="relative w-6 h-6">
                        <Image
                          src={
                            match.isHome
                              ? "/teams/cdEstepona.webp"
                              : `/teams/${match.team.crestUrl}`
                          }
                          alt={`Logo de ${
                            match.isHome ? match.team.name : "CD ESTEPONA"
                          }`}
                          fill
                          style={{ objectFit: "contain" }}
                          loading="lazy"
                          sizes="24px"
                        />
                      </div>
                      <span>vs</span>
                      <div className="relative w-6 h-6">
                        <Image
                          src={
                            match.isHome
                              ? `/teams/${match.team.crestUrl}`
                              : "/teams/cdEstepona.webp"
                          }
                          alt={`Logo de ${
                            match.isHome ? "CD ESTEPONA" : match.team.name
                          }`}
                          fill
                          style={{ objectFit: "contain" }}
                          loading="lazy"
                          sizes="24px"
                        />
                      </div>
                    </div>
                    <div className="text-[9px] md:text-[12px]">
                      {match.isHome
                        ? "Estadio Francisco Muñoz Pérez"
                        : match.team.location}
                    </div>
                    <div className="text-[9px] md:text-[12px] font-bold">
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
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
    </div>
  );
}
