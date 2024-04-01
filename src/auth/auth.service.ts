import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RiotAccessPermissionCodeDto } from './dto/riot-access-permission-code.dto';
import { SummonerAccountDto } from './dto/summoner-account.dto';
import { OauthPayloadDto } from './dto/oauth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  private RiotClientID = this.config.get('RIOT_CLIENT_ID');
  private RiotClientSecrete = this.config.get('RIOT_CLIENT_SECRETE');
  private HostRedirectUri = this.config.get('HOST_REDIRECT_URI');

  private RiotBaseUrlToken = this.config.get('RIOT_BASE_URL_TOKEN');
  private RiotBaseUrlAsia = this.config.get('RIOT_BASE_URL_ASIA');

  async getClientId() {
    const clientId = this.RiotClientID;
    const redirectUri = this.HostRedirectUri;

    return { clientId, redirectUri };
  }

  async rsoLogin(
    riotAccessPermissionCodeDto: RiotAccessPermissionCodeDto,
  ): Promise<any> {
    const tokenConfigs = {
      auth: {
        username: this.RiotClientID,
        password: this.RiotClientSecrete,
      },
    };

    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('code', riotAccessPermissionCodeDto.code);
    tokenParams.append('redirect_uri', this.HostRedirectUri);

    try {
      const accessTokenResponse = await this.httpService
        .post(this.RiotBaseUrlToken, tokenParams, tokenConfigs)
        .toPromise();

      const oauthPayload: OauthPayloadDto = accessTokenResponse.data;

      const tokenId = oauthPayload.id_token;

      const tokenInfo = {
        refreshToken: oauthPayload.refresh_token,
        accessToken: oauthPayload.access_token,
        expiresIn: oauthPayload.expires_in,
        tokenType: oauthPayload.token_type,
      };

      const GetSummonersAccountUrl = `${this.RiotBaseUrlAsia}/riot/account/v1/accounts/me`;

      const authConfig = {
        headers: {
          Authorization: `${tokenInfo.tokenType} ${tokenInfo.accessToken}`,
        },
      };

      const summonersAccountResponse = await this.httpService
        .get(GetSummonersAccountUrl, authConfig)
        .toPromise();

      const summonersAccount: SummonerAccountDto =
        summonersAccountResponse.data;

      return {
        authData: {
          tokenId,
          summonersAccount,
        },
      };
    } catch (error) {
      console.error(error);
    }
  }
}
