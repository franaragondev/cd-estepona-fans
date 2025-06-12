"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

function getResultColor(score: string | null | undefined, isHome: boolean) {
  if (!score) return "";

  const [homeScore, awayScore] = score.split(":").map(Number);

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

  const params = useParams();
  const rawLocale = params.locale;
  const locale = Array.isArray(rawLocale) ? rawLocale[0] : rawLocale || "es";

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

  const weekDayNames = Array.from({ length: 7 }, (_, i) =>
    new Date(2021, 10, 1 + i).toLocaleDateString(locale, { weekday: "short" })
  );

  function getMonthName(year: number, month: number, locale: string) {
    return new Date(year, month).toLocaleString(locale, { month: "long" });
  }

  return (
    <div className="px-4 py-8 mx-auto relative">
      <h1 className="sr-only">Calendario de Partidos</h1>

      <div className="flex justify-between mb-4 items-center">
        <button
          className="px-4 py-2 border rounded cursor-pointer capitalize"
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear(year - 1);
            } else {
              setMonth(month - 1);
            }
          }}
        >
          {getMonthName(
            month === 0 ? year - 1 : year,
            (month + 11) % 12,
            locale
          )}
        </button>

        <div className="font-semibold capitalize">
          <span className="hidden md:inline">
            {new Date(year, month).toLocaleString(locale, {
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="inline md:hidden">
            {new Date(year, month).toLocaleString(locale, {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <button
          className="px-4 py-2 border rounded cursor-pointer capitalize"
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear(year + 1);
            } else {
              setMonth(month + 1);
            }
          }}
        >
          {getMonthName(
            month === 11 ? year + 1 : year,
            (month + 1) % 12,
            locale
          )}
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70">
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
      )}

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
            const today = new Date();
            const dayDate = new Date(year, month, day);

            const isPast =
              dayDate <
              new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isToday =
              year === today.getFullYear() &&
              month === today.getMonth() &&
              day === today.getDate();

            const matchWithResult = dayMatches.find(
              (m) => m.score !== undefined
            );

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
              dayDate >
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
                className={`border rounded p-1 flex flex-col items-center gap-1 min-h-[80px] text-xs relative ${
                  isToday ? "bg-blue-50" : ""
                }${
                  isToday && dayMatches.length === 0
                    ? " ring ring-blue-400"
                    : ""
                } ${resultClass} ${pastNoResultClass} ${hasAnimatedBorder}`}
              >
                <div className="font-bold">{day}</div>
                {dayMatches.map((match) => {
                  const matchDate = new Date(match.date);
                  return (
                    <div
                      key={match.id}
                      className="w-full rounded p-0.5 flex flex-col items-center gap-0.5"
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
                          : matchDate.toLocaleTimeString(locale, {
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
    </div>
  );
}
