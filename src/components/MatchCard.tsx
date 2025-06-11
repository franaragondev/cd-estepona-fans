import Image from "next/image";

interface MatchCardProps {
  competition: string;
  stadium: string;
  dateTime: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  scoreHome: number | null;
  scoreAway: number | null;
}

export default function MatchCard({
  competition,
  stadium,
  dateTime,
  homeTeam,
  homeLogo,
  awayTeam,
  awayLogo,
  scoreHome,
  scoreAway,
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
      <div className="flex w-[90vw] mt-12 md:mt-16 md:w-[35vw] justify-around h-[8rem] md:h-[10rem]">
        <div className="w-[30vw] md:w-[15vw] justify-between flex flex-col items-center">
          <Image
            src={homeLogo}
            alt={`${homeTeam} logo`}
            width={96}
            height={96}
            className="object-contain"
          />
          <p className="mt-6 uppercase">{homeTeam}</p>
        </div>
        <div className="flex text-[44px] md:text-[60px] font-extrabold w-[30vw] md:w-[15vw] justify-center">
          <p>{scoreHome !== null ? scoreHome : "-"}</p>
          <p>:</p>
          <p>{scoreAway !== null ? scoreAway : "-"}</p>
        </div>
        <div className="w-[30vw] md:w-[15vw] justify-between flex flex-col items-center">
          <Image
            src={awayLogo}
            alt={`${awayTeam} logo`}
            width={96}
            height={96}
            className="object-contain"
          />
          <p className="mt-6 uppercase">{awayTeam}</p>
        </div>
      </div>
    </div>
  );
}
