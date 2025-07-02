"use client";

import React from "react";
import Image from "next/image";
import { toZonedTime } from "date-fns-tz";
import { formatZonedDate } from "@/utils/formatZonedDate";

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
  const today = toZonedTime(new Date(), "Europe/Madrid");

  const weekDayNames = Array.from({ length: 7 }, (_, i) =>
    formatZonedDate(new Date(2021, 10, 1 + i), locale, { weekday: "short" })
  );

  const firstWeekDay = (new Date(year, month, 1).getDay() + 6) % 7;

  return (
    <div className="grid grid-cols-7 gap-2 text-center">
      {weekDayNames.map((day, i) => (
        <div key={i} className="font-semibold border-b pb-1 capitalize">
          {day}
        </div>
      ))}

      {Array(firstWeekDay)
        .fill(null)
        .map((_, i) => (
          <div key={"empty" + i} />
        ))}

      {Array(days)
        .fill(null)
        .map((_, i) => {
          const day = i + 1;
          const dayMatches = matchesByDay[day] || [];

          const dayDate = toZonedTime(
            new Date(Date.UTC(year, month, day)),
            "Europe/Madrid"
          );

          const todayYMD = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
          );
          const dayYMD = new Date(
            dayDate.getFullYear(),
            dayDate.getMonth(),
            dayDate.getDate()
          );

          const isPast = dayYMD < todayYMD;
          const isToday = dayYMD.getTime() === todayYMD.getTime();

          const matchWithResult = dayMatches.find((m) => m.score !== undefined);

          const resultClass =
            isPast && matchWithResult
              ? getResultColor(matchWithResult.score!, matchWithResult.isHome)
              : "";

          const pastNoResultClass =
            isPast && !matchWithResult
              ? "bg-gray-100 text-gray-400 line-through"
              : "";

          const isFutureWithMatch = dayYMD > todayYMD && dayMatches.length > 0;

          const hasAnimatedBorder =
            isFutureWithMatch || (isToday && dayMatches.length > 0)
              ? "animated-border"
              : "";

          return (
            <div
              key={day}
              className={`rounded p-1 flex flex-col items-center gap-1 min-h-[80px] text-xs relative
                ${hasAnimatedBorder ? "" : "border"}
                ${isToday ? "bg-blue-50" : ""}
                ${
                  isToday && dayMatches.length === 0 ? "ring ring-blue-400" : ""
                }
                ${resultClass} ${pastNoResultClass} ${hasAnimatedBorder}`}
            >
              <div className="font-bold">{day}</div>

              {dayMatches.map((match) => {
                const matchDate = toZonedTime(
                  new Date(match.date),
                  "Europe/Madrid"
                );

                const utcHours = new Date(match.date).getUTCHours();
                const utcMinutes = new Date(match.date).getUTCMinutes();

                const formattedTime =
                  utcHours === 0 && utcMinutes === 0
                    ? "N/D"
                    : matchDate.toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                        timeZone: "Europe/Madrid",
                      });

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
                          alt={match.isHome ? "CD Estepona" : match.team.name}
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
                          alt={match.isHome ? match.team.name : "CD Estepona"}
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
                        : formattedTime}
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
