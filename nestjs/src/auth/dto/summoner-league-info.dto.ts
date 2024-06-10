export class SummonerLeagueInfoDto {
  encryptedPUUID: string;

  summonerName: string;

  summonerTag: string;

  summonerLevel: string;

  profileIconId: number;

  tier?: string;

  rank?: string;

  leaguePoints?: number;

  wins?: number;

  losses?: number;
}
