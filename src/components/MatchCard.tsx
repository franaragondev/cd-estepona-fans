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
      <div>
        <p className="text-[20px] mb-0 text-center uppercase">{competition}</p>
        <p className="text-[16px] mb-2 opacity-80 text-center uppercase">
          {stadium}
        </p>
        <p className="text-[22px] mb-0 text-center uppercase">{dateTime}</p>
      </div>
      <div className="flex w-[90vw] mt-1 md:mt-16 md:w-[35vw] justify-around">
        <div className="w-[30vw] md:w-[15vw] justify-center flex flex-col items-center">
          <img
            className="w-18 md:w-24"
            src={homeLogo}
            alt={`${homeTeam} logo`}
          />
          <p className="mt-6">{homeTeam}</p>
        </div>
        <div className="flex text-[44px] md:text-[60px] font-extrabold w-[30vw] md:w-[15vw] justify-center">
          <p>{scoreHome !== null ? scoreHome : "-"}</p>
          <p>:</p>
          <p>{scoreAway !== null ? scoreAway : "-"}</p>
        </div>
        <div className="w-[30vw] md:w-[15vw] justify-center flex flex-col items-center">
          <img
            className="w-18 md:w-24"
            src={awayLogo}
            alt={`${awayTeam} logo`}
          />
          <p className="mt-6">{awayTeam}</p>
        </div>
      </div>
    </div>
  );
}
