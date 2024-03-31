import { IsNotEmpty } from 'class-validator';

export class OauthPayloadDto {
  @IsNotEmpty()
  id_token: string;

  @IsNotEmpty()
  refresh_token: string;

  @IsNotEmpty()
  access_token: string;

  @IsNotEmpty()
  expires_in: number;

  @IsNotEmpty()
  token_type: string;
}
