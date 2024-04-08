import { IsNotEmpty } from 'class-validator';

export class SpectateSummonerDto {
  @IsNotEmpty()
  summonerName: string;

  @IsNotEmpty()
  summonerTag: string;

  @IsNotEmpty()
  encryptedSummonerId: string;
}
