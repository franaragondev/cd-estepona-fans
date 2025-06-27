"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MatchCalendar from "@/components/MatchCalendar";
import MatchCalendarMobile from "@/components/MatchCalendarMobile";

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

  const matchesByDay = matches.reduce((acc, match) => {
    const day = new Date(match.date).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  function getMonthName(year: number, month: number, locale: string) {
    return new Date(year, month).toLocaleString(locale, { month: "long" });
  }

  function prevMonth() {
    setMatches([]);
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  }

  function nextMonth() {
    setMatches([]);
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-4xl md:max-w-full md:mx-0 relative">
      <h1 className="sr-only">Calendario de Partidos</h1>

      <div className="flex justify-between mb-6 items-center">
        <button
          className="px-4 py-2 border rounded cursor-pointer capitalize"
          onClick={prevMonth}
          aria-label="Mes anterior"
        >
          {getMonthName(
            month === 0 ? year - 1 : year,
            (month + 11) % 12,
            locale
          )}
        </button>

        <div className="font-semibold capitalize text-lg">
          {new Date(year, month).toLocaleString(locale, {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button
          className="px-4 py-2 border rounded cursor-pointer capitalize"
          onClick={nextMonth}
          aria-label="Mes siguiente"
        >
          {getMonthName(
            month === 11 ? year + 1 : year,
            (month + 1) % 12,
            locale
          )}
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/70">
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

      <div className="block md:hidden">
        <MatchCalendarMobile
          matchesByDay={matchesByDay}
          year={year}
          month={month}
          locale={locale}
        />
      </div>

      <div className="hidden md:block ">
        <MatchCalendar
          matchesByDay={matchesByDay}
          year={year}
          month={month}
          locale={locale}
        />
      </div>
    </div>
  );
}
