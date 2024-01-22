import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LolService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  private RiotBaseUrlAsia = this.config.get('RIOT_BASE_URL_ASIA');
  private RiotBaseUrlKr = this.config.get('RIOT_BASE_URL_KR');
  private RiotAppKey = this.config.get('RIOT_API_APP_KEY');

  async getSummonersEncryptedId(body): Promise<any> {
    const { summonersName, summonersTag } = body;

    console.log(`-----------------------------------------------------------`);
    console.log(`조회 계정: ${summonersName} #${summonersTag}`);

    const encodedSummonersName = encodeURIComponent(summonersName);
    const encodedSummonersTag = encodeURIComponent(summonersTag);

    const GetSummonersEncryptedPuuidUrl = `${this.RiotBaseUrlAsia}/riot/account/v1/accounts/by-riot-id/${encodedSummonersName}/${encodedSummonersTag}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersNameTag = await this.httpService
        .get(GetSummonersEncryptedPuuidUrl)
        .toPromise();
    } catch (error) {
      console.log('소환사 계정 검색 에러: ', error.response.status);
      if (error.response.status === 403)
        return {
          message: `이름 또는 태그를 입력해 주세요.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
      else if (error.response.status === 400)
        return {
          message: `잘못된 입력입니다.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
      else if (error.response.status === 404)
        return {
          message: `존재하지 않는 아이디입니다.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
    }

    const summonersEncryptedPuuid = responseBySummonersNameTag.data.puuid;

    const GetEncryptedSummonersIdUrl = `${this.RiotBaseUrlKr}/lol/summoner/v4/summoners/by-puuid/${summonersEncryptedPuuid}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersPuuid = await this.httpService
        .get(GetEncryptedSummonersIdUrl)
        .toPromise();
    } catch (error) {
      console.log('소환사 암호화ID 검색 에러: ', error.response.status);
      if (error.response.status === 404)
        return `리그오브레전드 아이디가 아닙니다.<br>(code: ${error.response.status})`;
    }

    const summonersEncryptedId = responseBySummonersPuuid.data.id;

    const GetSummonersInfoUrl = `${this.RiotBaseUrlKr}/lol/league/v4/entries/by-summoner/${summonersEncryptedId}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersEncryptedId = await this.httpService
        .get(GetSummonersInfoUrl)
        .toPromise();
    } catch (error) {
      console.log('소환사 정보 검색 에러: ', error.response.status);
      if (error.response.status === 404)
        return {
          message: `소환사 정보가 존재하지 않습니다.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
    }

    const summonersInfo = responseBySummonersEncryptedId.data;

    return { summonersEncryptedId, summonersInfo };
  }

  async getSummonersRealTime(body): Promise<any> {
    const { summonersName, summonersEncryptedId } = body;

    const GetStartGameTimeUrl = `${this.RiotBaseUrlKr}/lol/spectator/v4/active-games/by-summoner/${summonersEncryptedId}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersId = await this.httpService
        .get(GetStartGameTimeUrl)
        .toPromise();
    } catch (error) {
      console.log('인게임 검색 에러: ', error.response.status);
      if (error.response.status === 404)
        return {
          message: `'${summonersName}'<br>님은 현재 게임중이 아닙니다.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
    }

    const gameStartTime = responseBySummonersId.data.gameStartTime;

    console.log('gameStartTime: ', gameStartTime);

    const time = new Date(gameStartTime + 30 * 1000); // 인게임 딜레이 30초 추가

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const startTimeString = `${hours}시 ${minutes}분 ${seconds}초`;

    console.log('게임 시작 시간:', startTimeString);

    const currentEpochTime = new Date().getTime();

    const realTimeSeconds = Math.floor(
      (currentEpochTime - (gameStartTime + 30 * 1000)) / 1000,
    );

    const h = Math.floor(realTimeSeconds / 3600);
    const m = Math.floor((realTimeSeconds % 3600) / 60);
    const s = realTimeSeconds % 60;

    const realTimeString = `${h}시간 ${m}분 ${s}초`;
    console.log('게임 진행 시간:', realTimeString);

    let status = false;

    if (currentEpochTime < gameStartTime + 30000)
      status = false; // 로딩중 일때는 실제 시간이 더 느림
    else status = true; // 게임 시작하면 같아짐

    return {
      name: summonersName,
      inGamedSummonersName: `'${summonersName}'<br>님의 게임이 시작되었습니다.`,
      status,
      startTimeString,
      realTimeSeconds,
    };
  }
}
