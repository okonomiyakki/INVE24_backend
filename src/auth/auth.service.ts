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

  async rsoLogin(accessCode: RiotAccessPermissionCodeDto): Promise<any> {
    console.log('#1 accessCode: ', accessCode);

    const tokenConfigs = {
      auth: {
        username: this.RiotClientID,
        password: this.RiotClientSecrete,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    const tokenParams = new URLSearchParams();
    tokenParams.append('code', `${accessCode}`);
    tokenParams.append('redirect_uri', `${this.HostRedirectUri}`);
    tokenParams.append('grant_type', 'authorization_code');

    const accessTokenResponse = await this.httpService
      .post(this.RiotBaseUrlToken, tokenParams, tokenConfigs)
      .toPromise();

    console.log('#2 accessTokenResponse: ', accessTokenResponse);

    const oauthPayload: OauthPayloadDto = accessTokenResponse.data;

    const tokenId = oauthPayload.id_token;

    const tokenInfo = {
      refresh_token: oauthPayload.refresh_token,
      access_token: oauthPayload.access_token,
      expires_in: oauthPayload.expires_in,
      token_type: oauthPayload.token_type,
    };

    const GetSummonersAccountUrl = `${this.RiotBaseUrlAsia}/riot/account/v1/accounts/me`;

    const authConfig = {
      headers: {
        Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`,
      },
    };

    const summonersAccountResponse = await this.httpService
      .post(GetSummonersAccountUrl, tokenParams, authConfig)
      .toPromise();

    const summonersAccount: SummonerAccountDto = summonersAccountResponse.data;

    console.log('tokenId : ', tokenId);
    console.log('summonersAccount : ', summonersAccount);

    return {
      authData: {
        tokenId,
        summonersAccount,
      },
    };
  }
}
