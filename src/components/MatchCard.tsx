import Image from "next/image";

interface MatchCardProps {
  competition: string;
  stadium: string;
  dateTime: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  score: string;
}

export default function MatchCard({
  competition,
  stadium,
  dateTime,
  homeTeam,
  homeLogo,
  awayTeam,
  awayLogo,
  score,
}: MatchCardProps) {
  return (
    <div className="mt-14 text-center text-white flex flex-col items-center">
      <div className="h-[8rem] md:h-[7rem]">
        <p className="text-[20px] mb-0 text-center uppercase">{competition}</p>
        <p className="text-[16px] mb-2 opacity-80 text-center uppercase">
          {stadium}
        </p>
        <p className="text-[22px] mb-0 text-center uppercase">{dateTime}</p>
      </div>
      <div className="flex w-[90vw] mt-12 md:mt-16 md:w-[35vw] justify-around h-[10rem]">
        <div className="w-[30vw] md:w-[15vw] flex flex-col items-center">
          <div className="relative w-24 h-24">
            <Image
              src={homeLogo}
              alt={`${homeTeam} logo`}
              fill
              style={{ objectFit: "contain" }}
              sizes="96px"
            />
          </div>
          <p className="mt-6 uppercase">{homeTeam}</p>
        </div>
        <div className="flex text-[44px] md:text-[60px] font-extrabold w-[30vw] md:w-[15vw] justify-center">
          <p>{score !== null ? score : "-"}</p>
        </div>
        <div className="w-[30vw] md:w-[15vw] flex flex-col items-center">
          <div className="relative w-24 h-24">
            <Image
              src={awayLogo}
              alt={`${awayTeam} logo`}
              fill
              style={{ objectFit: "contain" }}
              sizes="96px"
            />
          </div>
          <p className="mt-6 uppercase">{awayTeam}</p>
        </div>
      </div>
    </div>
  );
}
