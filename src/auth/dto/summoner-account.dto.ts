import { IsNotEmpty } from 'class-validator';

export class SummonerAccountDto {
  @IsNotEmpty()
  puuid: string;

  @IsNotEmpty()
  summonersName: string;

  @IsNotEmpty()
  summonersTag: string;
}
