// types/index.ts
import { Player, PlayerSeasonStat } from "@prisma/client";

export type PlayerWithStats = Player & {
  stats: PlayerSeasonStat[];
};
