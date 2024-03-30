import { IsNotEmpty } from 'class-validator';

export class SpectateSummonerDto {
  @IsNotEmpty()
  summonersName: string;

  @IsNotEmpty()
  summonersTag: string;

  @IsNotEmpty()
  summonersEncryptedId: string;
}
