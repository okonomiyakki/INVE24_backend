import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RiotAccessPermissionCodeDto } from './dto/riot-access-permission-code.dto';
import { OauthPayloadDto } from './dto/oauth-payload.dto';
import { AccountDto } from './dto/account.dto';
import { SummonerDto } from './dto/summoner.dto';
import { LeagueEntryDto } from './dto/league-entry.dto';
import { SummonerLeagueInfoDto } from './dto/summoner-league-info.dto';

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

  private RiotBaseUrlKr = this.config.get('RIOT_BASE_URL_KR');
  private RiotAppKey = this.config.get('RIOT_API_APP_KEY');

  async getOAuthData(res: Response) {
    const clientId = this.RiotClientID;
    const redirectUri = this.HostRedirectUri;

    return res.status(200).json({
      status: 'success',
      message: null,
      data: { clientId, redirectUri },
    });
  }

  async riotSignOnUser(
    riotAccessPermissionCodeDto: RiotAccessPermissionCodeDto,
    res: Response,
  ): Promise<any> {
    const { code } = riotAccessPermissionCodeDto;

    const tokenConfigs = {
      auth: {
        username: this.RiotClientID,
        password: this.RiotClientSecrete,
      },
    };

    const tokenParams = new URLSearchParams();

    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('code', code);
    tokenParams.append('redirect_uri', this.HostRedirectUri);

    try {
      var accessTokenResponse = await this.httpService
        .post(this.RiotBaseUrlToken, tokenParams, tokenConfigs)
        .toPromise();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 'error',
        message: 'token error',
      });
    }

    const oauthPayload: OauthPayloadDto = accessTokenResponse.data;

    console.log('oauthPayload : ', oauthPayload);

    const tokenId = oauthPayload.id_token;

    const tokenInfo = {
      refreshToken: oauthPayload.refresh_token,
      accessToken: oauthPayload.access_token,
      expiresIn: oauthPayload.expires_in,
      tokenType: oauthPayload.token_type,
    };

    const GetAccountUrl = `${this.RiotBaseUrlAsia}/riot/account/v1/accounts/me`;

    const GetSummonertUrl = `${this.RiotBaseUrlAsia}/lol/summoner/v4/summoners/me`;

    const authConfig = {
      headers: {
        Authorization: `${tokenInfo.tokenType} ${tokenInfo.accessToken}`,
      },
    };

    const accountResponse = await this.httpService
      .get(GetAccountUrl, authConfig)
      .toPromise();

    const account: AccountDto = accountResponse.data;

    const summonerResponse = await this.httpService
      .get(GetSummonertUrl, authConfig)
      .toPromise();

    const summoner: SummonerDto = summonerResponse.data;

    const encryptedSummonerId = summoner.id;

    const GetLeagueEntryUrl = `${this.RiotBaseUrlKr}/lol/league/v4/entries/by-summoner/${encryptedSummonerId}?api_key=${this.RiotAppKey}`;

    const leagueEntryResponse = await this.httpService
      .get(GetLeagueEntryUrl)
      .toPromise();

    const leagueEntry: LeagueEntryDto = leagueEntryResponse.data;

    const summonerLeagueInfo: SummonerLeagueInfoDto = {
      encryptedSummonerId: summoner.id,

      summonerName: account.gameName,

      summonerTag: account.tagLine,

      summonerLevel: summoner.summonerLevel,

      profileIconId: summoner.profileIconId,

      tier: leagueEntry.tier,

      rank: leagueEntry.rank,

      leaguePoints: leagueEntry.leaguePoints,

      wins: leagueEntry.wins,

      losses: leagueEntry.losses,
    };

    return res.status(200).json({
      status: 'success',
      message: null,
      data: { tokenId, summonerLeagueInfo },
    });
  }
}
