import { IsNotEmpty } from 'class-validator';

export class SearchSummonerDto {
  @IsNotEmpty()
  summonersName: string;

  @IsNotEmpty()
  summonersTag: string;
}
