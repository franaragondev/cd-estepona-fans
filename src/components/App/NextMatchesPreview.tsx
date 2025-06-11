"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import MatchCard from "../MatchCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface Match {
  id: string;
  competition: string;
  stadium: string;
  date: string; // ISO date string from API
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  scoreHome: number | null;
  scoreAway: number | null;
}

interface RawMatch {
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

export default function NextMatchesPreview() {
  const locale = useLocale();

  const [previousMatches, setPreviousMatches] = useState<Match[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      try {
        setLoading(true);
        const res = await fetch("/api/matches");
        if (!res.ok) throw new Error("Failed to fetch matches");
        const data = await res.json();

        const now = new Date();

        const previous: Match[] = [];
        const upcoming: Match[] = [];

        data.forEach((m: RawMatch) => {
          const matchDate = new Date(m.date);
          const match: Match = {
            id: m.id,
            competition: m.competition,
            stadium: m.stadium || m.location || "",
            date: m.date,
            homeTeam: m.isHome ? "CD ESTEPONA" : m.opponent,
            homeLogo: m.isHome
              ? "/logo-simple.webp"
              : `/teams/${m.opponentImage}`,
            awayTeam: m.isHome ? m.opponent : "CD ESTEPONA",
            awayLogo: m.isHome
              ? `/teams/${m.opponentImage}`
              : "/logo-simple.webp",
            scoreHome: m.isHome
              ? m.score
                ? parseScoreHome(m.score)
                : null
              : m.score
              ? parseScoreAway(m.score)
              : null,
            scoreAway: m.isHome
              ? m.score
                ? parseScoreAway(m.score)
                : null
              : m.score
              ? parseScoreHome(m.score)
              : null,
          };

          if (matchDate < now) previous.push(match);
          else upcoming.push(match);
        });

        previous.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        upcoming.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setPreviousMatches(previous);
        setUpcomingMatches(upcoming);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, []);

  function parseScoreHome(scoreStr: string) {
    return parseInt(scoreStr.split("-")[0], 10);
  }
  function parseScoreAway(scoreStr: string) {
    return parseInt(scoreStr.split("-")[1], 10);
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });
  }

  if (loading) {
    return (
      <section>
        <div className="flex flex-col md:flex-row justify-center items-center h-[1200px] md:h-[740px]">
          {/* Previous matches slider */}
          <div className="relative w-full md:w-1/2 h-[600px] md:h-[740px] bg-[url('/team.jpeg')] bg-cover bg-center ">
            <div className="absolute inset-0 bg-[rgba(220,44,32,0.8)]"></div>
            <div className="relative z-10 flex justify-center pt-6 flex-col items-center w-full h-full">
              <h2 className="text-white text-4xl md:text-5xl mt-4 md:mt-14 font-light italic uppercase">
                Anteriores
              </h2>
              <div className="w-full h-full flex flex-col justify-between swiper-container-custom"></div>
            </div>
          </div>

          {/* Upcoming matches slider */}
          <div className="relative w-full md:w-1/2 h-[600px] md:h-[740px] bg-[url('/team2.jpeg')] bg-cover bg-center">
            <div className="absolute inset-0 bg-[rgba(47,54,161,0.8)]"></div>
            <div className="relative z-10 flex justify-center pt-6 flex-col items-center w-full h-full">
              <h2 className="text-white text-4xl md:text-5xl mt-4 md:mt-14 font-light italic uppercase">
                Próximos
              </h2>
              <div className="w-full h-full flex flex-col justify-between swiper-container-custom"></div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${locale}/partidos`}
            className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
          >
            Ver calendario completo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-center items-center h-[1200px] md:h-[740px]">
        {/* Previous matches slider */}
        <div className="relative w-full md:w-1/2 h-[600px] md:h-[740px] bg-[url('/team.jpeg')] bg-cover bg-center ">
          <div className="absolute inset-0 bg-[rgba(220,44,32,0.8)]"></div>
          <div className="relative z-10 flex justify-center pt-6 flex-col items-center w-full h-full">
            <h2 className="text-white text-4xl md:text-5xl mt-4 md:mt-14 font-light italic uppercase">
              Anteriores
            </h2>
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              initialSlide={previousMatches.length}
              className="w-full h-full flex flex-col justify-between swiper-container-custom"
            >
              <SwiperSlide className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <Link
                    href={`/${locale}/partidos`}
                    className="px-6 py-3 rounded text-white bg-[#2f36a1] transition-colors duration-200 -mt-26 cursor-pointer"
                  >
                    Ver calendario completo
                  </Link>
                </div>
              </SwiperSlide>

              {previousMatches.length > 0 &&
                previousMatches.map((match) => (
                  <SwiperSlide
                    key={match.id}
                    className="flex justify-center items-center"
                  >
                    <MatchCard
                      competition={match.competition}
                      stadium={match.stadium}
                      dateTime={formatDate(match.date)}
                      homeTeam={match.homeTeam}
                      homeLogo={match.homeLogo}
                      awayTeam={match.awayTeam}
                      awayLogo={match.awayLogo}
                      scoreHome={match.scoreHome}
                      scoreAway={match.scoreAway}
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        </div>

        {/* Upcoming matches slider */}
        <div className="relative w-full md:w-1/2 h-[600px] md:h-[740px] bg-[url('/team2.jpeg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-[rgba(47,54,161,0.8)]"></div>
          <div className="relative z-10 flex justify-center pt-6 flex-col items-center w-full h-full">
            <h2 className="text-white text-4xl md:text-5xl mt-4 md:mt-14 font-light italic uppercase">
              Próximos
            </h2>
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              className="w-full h-full flex flex-col justify-between swiper-container-custom"
            >
              {upcomingMatches.length > 0 &&
                upcomingMatches.map((match) => (
                  <SwiperSlide
                    key={match.id}
                    className="flex justify-center items-center"
                  >
                    <MatchCard
                      competition={match.competition}
                      stadium={match.stadium}
                      dateTime={formatDate(match.date)}
                      homeTeam={match.homeTeam}
                      homeLogo={match.homeLogo}
                      awayTeam={match.awayTeam}
                      awayLogo={match.awayLogo}
                      scoreHome={match.scoreHome}
                      scoreAway={match.scoreAway}
                    />
                  </SwiperSlide>
                ))}
              <SwiperSlide className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <Link
                    href={`/${locale}/partidos`}
                    className="px-6 py-3 rounded text-white bg-[#2f36a1] transition-colors duration-200 -mt-26 cursor-pointer"
                  >
                    Ver calendario completo
                  </Link>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href={`/${locale}/partidos`}
          className="inline-block px-4 py-2 rounded text-white bg-[#DC2C20] hover:bg-[#2f36a1] transition-colors duration-200 cursor-pointer"
        >
          Ver calendario completo
        </Link>
      </div>
    </section>
  );
}
