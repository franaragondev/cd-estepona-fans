"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import MatchCard from "../MatchCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Array of previous matches data
const previousMatches = [
  {
    id: 1,
    competition: "2ª Federación",
    stadium: "Estadio Francisco Muñoz Pérez",
    dateTime: "Sunday, May 25 20:45 CEST",
    homeTeam: "CD ESTEPONA",
    homeLogo: "/logo-simple.webp",
    awayTeam: "CD ESTEPONA",
    awayLogo: "/logo-simple.webp",
    score: {
      home: 0,
      away: 2,
    },
  },
  {
    id: 2,
    competition: "2ª Federación",
    stadium: "Estadio Municipal",
    dateTime: "Tuesday, June 10 18:00 CEST",
    homeTeam: "CD ESTEPONA",
    homeLogo: "/logo-simple.webp",
    awayTeam: "Atlético Marbella",
    awayLogo: "/logo-simple.webp",
    score: {
      home: 5,
      away: 1,
    },
  },
  {
    id: 3,
    competition: "2ª Federación",
    stadium: "Campo La Rada",
    dateTime: "Tuesday, June 17 19:00 CEST",
    homeTeam: "CD ESTEPONA",
    homeLogo: "/logo-simple.webp",
    awayTeam: "UD San Pedro",
    awayLogo: "/logo-simple.webp",
    score: {
      home: 2,
      away: 4,
    },
  },
];

const upcomingMatches = [
  {
    id: 4,
    competition: "2ª Federación",
    stadium: "Estadio Municipal",
    dateTime: "Sunday, July 7 18:30 CEST",
    homeTeam: "CD ESTEPONA",
    homeLogo: "/logo-simple.webp",
    awayTeam: "Marbella FC",
    awayLogo: "/logo-simple.webp",
  },
  {
    id: 5,
    competition: "2ª Federación",
    stadium: "Campo de Fútbol La Rada",
    dateTime: "Saturday, July 13 20:00 CEST",
    homeTeam: "CD ESTEPONA",
    homeLogo: "/logo-simple.webp",
    awayTeam: "San Fernando CD",
    awayLogo: "/logo-simple.webp",
  },
  {
    id: 6,
    competition: "2ª Federación",
    stadium: "Estadio Francisco Muñoz Pérez",
    dateTime: "Sunday, July 21 19:00 CEST",
    homeTeam: "CD ESTEPONA",
    homeLogo: "/logo-simple.webp",
    awayTeam: "CF Talavera",
    awayLogo: "/logo-simple.webp",
  },
];

export default function NextMatchesPreview() {
  // Reverse the array to show matches from oldest to newest
  const matchesOrdered = [...previousMatches].reverse();
  const locale = useLocale();

  return (
    <section>
      {/* Section title */}
      {/* <h2 className="text-2xl font-semibold mb-4 text-center">Partidos</h2> */}

      {/* Main container with responsive layout */}
      <div className="flex flex-col md:flex-row justify-center items-center h-[1200px] md:h-[740px]">
        {/* Left side: Previous matches slider */}
        <div className="relative w-full md:w-1/2 h-[600px] md:h-[740px] bg-[url('/team.jpeg')] bg-cover bg-center ">
          {/* Overlay with red semi-transparent background */}
          <div className="absolute inset-0 bg-[rgba(220,44,32,0.8)]"></div>

          {/* Content container with z-index to be above the overlay */}
          <div className="relative z-10 flex justify-center pt-6 flex-col items-center w-full h-full">
            <h2 className="text-white text-4xl md:text-5xl mt-4 md:mt-14 font-light italic uppercase">
              Anteriores
            </h2>

            {/* Swiper component for previous matches */}
            <Swiper
              modules={[Navigation, Pagination, EffectFade]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              initialSlide={matchesOrdered.length}
              className="w-full h-full flex flex-col justify-between swiper-container-custom"
            >
              {/* Empty slide with button */}
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

              {/* Map previous matches from oldest to newest */}
              {matchesOrdered.map((match) => (
                <SwiperSlide
                  key={match.id}
                  className="flex justify-center items-center"
                >
                  <MatchCard
                    competition={match.competition}
                    stadium={match.stadium}
                    dateTime={match.dateTime}
                    homeTeam={match.homeTeam}
                    homeLogo={match.homeLogo}
                    awayTeam={match.awayTeam}
                    awayLogo={match.awayLogo}
                    scoreHome={match.score.home}
                    scoreAway={match.score.away}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right side: Placeholder for upcoming matches */}
        <div className="relative w-full md:w-1/2 h-[600px] md:h-[740px] bg-[url('/team2.jpeg')] bg-cover bg-center">
          {/* Blue overlay */}
          <div className="absolute inset-0 bg-[rgba(47,54,161,0.8)]"></div>

          {/* Title container */}
          <div className="relative z-10 flex justify-center pt-6 flex-col items-center w-full h-full">
            <h2 className="text-white text-4xl md:text-5xl mt-4 md:mt-14 font-light italic uppercase">
              Próximos
            </h2>
            {/* Swiper component for previous matches */}
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
              {/* Map previous matches from oldest to newest */}
              {upcomingMatches.map((match) => (
                <SwiperSlide
                  key={match.id}
                  className="flex justify-center items-center"
                >
                  <MatchCard
                    competition={match.competition}
                    stadium={match.stadium}
                    dateTime={match.dateTime}
                    homeTeam={match.homeTeam}
                    homeLogo={match.homeLogo}
                    awayTeam={match.awayTeam}
                    awayLogo={match.awayLogo}
                    scoreHome={null}
                    scoreAway={null}
                  />
                </SwiperSlide>
              ))}
              {/* Empty slide with button */}
              <SwiperSlide className="flex justify-center items-center">
                <div className="flex flex-col justify-center items-center w-full h-full">
                  <Link
                    href={`/${locale}/partidos`}
                    className="px-6 py-3 rounded text-white bg-[#DC2C20] transition-colors duration-200 -mt-26 cursor-pointer"
                  >
                    Ver calendario completo
                  </Link>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>

      {/* Button to view full calendar */}
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
