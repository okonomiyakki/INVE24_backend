export class LeagueEntryDto {
  leagueId?: string;

  summonerId?: number;

  summonerName?: string;

  queueType?: string;

  tier?: string;

  rank?: string;

  leaguePoints?: number;

  wins?: number;

  losses?: number;

  hotStreak?: boolean;

  veteran?: boolean;

  freshBlood?: boolean;

  inactive?: boolean;
}
