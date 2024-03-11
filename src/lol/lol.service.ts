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

  private SummonerSuccessWebHookUrl =
    this.config.get('DISCORD_WEBHOOK_URL_SUMMONER') || undefined;
  private IngameSuccessWebHookUrl =
    this.config.get('DISCORD_WEBHOOK_URL_INGAME') || undefined;
  private SummonerErrorWebHookUrl =
    this.config.get('DISCORD_WEBHOOK_URL_SUMMONER_ERROR') || undefined;
  private IngameErrorWebHookUrl =
    this.config.get('DISCORD_WEBHOOK_URL_INGAME_ERROR') || undefined;
  private ServerErrorWebHookUrl =
    this.config.get('DISCORD_WEBHOOK_URL_SERVER_ERROR') || undefined;

  private getCurrentDate() {
    const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

    const YEAR = new Date().getFullYear();
    const MONTH = new Date().getMonth();
    const DATE = new Date().getDate();
    const DAY = DAYS[new Date().getDay()];
    const HOUR = new Date().getHours();
    const MINUTE = new Date().getMinutes();
    const SECOND = new Date().getSeconds();

    const currentTime = `${YEAR}/${MONTH}/${DATE}/${DAY} ${HOUR}시${MINUTE}분${SECOND}초`;

    return currentTime;
  }

  private async sendToWebHook(webHookInfo, offset: string) {
    let about = '';
    switch (offset) {
      case 'server error':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 서버 오류.`;
        break;
      case '#1 forbiden':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 이름 또는 태그를 입력해 주세요.`;
        break;
      case '#1 bad request':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 잘못된 입력입니다.`;
        break;
      case '#1 not found':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 존재하지 않는 아이디입니다.`;
        break;
      case '#2 not found':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}.
[${webHookInfo.title.error.response.status}] 리그오브레전드 아이디가 아닙니다`;
        break;
      case '#3 not found':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 소환사 정보가 존재하지 않습니다.`;
        break;
      case 'summoner OK':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}`;
        break;
      case '#4 forbiden':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[403.1] 게임 시작 3분이 경과되어 조회가 불가능합니다.`;
        break;
      case '#4 not found':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 현재 게임중이 아닙니다.`;
        break;
      case '#5 too many request':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[${webHookInfo.title.error.response.status}] 현재 요청자가 많아 이용이 어렵습니다.`;
        break;
      case 'loading OK':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
로딩중...`;
        break;
      case '#5 forbiden':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
[403.2] 로딩 시간이 5분 경과되어 이용이 어렵습니다. 다시 시도해 주세요.`;
        break;
      case 'start OK':
        about = `${webHookInfo.title.summonersName} #${webHookInfo.title.summonersTag}
게임이 시작되었습니다.`;
        break;
    }

    const contents = {
      embeds: [
        {
          title: about,
          description: webHookInfo.currentDate,
          color: 3447003,
        },
      ],
    };

    if (webHookInfo.url)
      await this.httpService.post(webHookInfo.url, contents).toPromise();
  }

  async getSummonersEncryptedId(body): Promise<any> {
    const { summonersName, summonersTag } = body;

    // console.log(`----------------------------------------------`);
    // console.log(`조회 계정: ${summonersName} #${summonersTag}`);

    const encodedSummonersName = encodeURIComponent(summonersName);
    const encodedSummonersTag = encodeURIComponent(summonersTag);

    const GetSummonersEncryptedPuuidUrl = `${this.RiotBaseUrlAsia}/riot/account/v1/accounts/by-riot-id/${encodedSummonersName}/${encodedSummonersTag}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersNameTag = await this.httpService
        .get(GetSummonersEncryptedPuuidUrl)
        .toPromise();
    } catch (error) {
      console.log('소환사 계정 검색 에러: ', error.response.status);

      const webHookInfo = {
        url: this.SummonerErrorWebHookUrl,
        title: {
          summonersName,
          summonersTag,
          error,
        },
        currentDate: `${this.getCurrentDate()}`,
      };

      if (error.response.status === 403) {
        await this.sendToWebHook(webHookInfo, '#1 forbiden');

        return {
          message: `이름 또는 태그를 입력해 주세요.`,
          errorCode: error.response.status,
        };
      } else if (error.response.status === 400) {
        await this.sendToWebHook(webHookInfo, '#1 bad request');

        return {
          message: `잘못된 입력입니다.`,
          errorCode: error.response.status,
        };
      } else if (error.response.status === 404) {
        await this.sendToWebHook(webHookInfo, '#1 not found');

        return {
          message: `존재하지 않는 아이디입니다.`,
          errorCode: error.response.status,
        };
      } else {
        await this.sendToWebHook(
          {
            url: this.ServerErrorWebHookUrl,
            title: {
              summonersName,
              summonersTag,
              error,
            },
            currentDate: `${this.getCurrentDate()}`,
          },
          'server error',
        );

        return {
          message: `서버 오류.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
      }
    }

    const summonersEncryptedPuuid = responseBySummonersNameTag.data.puuid;

    const GetEncryptedSummonersIdUrl = `${this.RiotBaseUrlKr}/lol/summoner/v4/summoners/by-puuid/${summonersEncryptedPuuid}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersPuuid = await this.httpService
        .get(GetEncryptedSummonersIdUrl)
        .toPromise();
    } catch (error) {
      console.log('소환사 암호화ID 검색 에러: ', error.response.status);

      const webHookInfo = {
        url: this.SummonerErrorWebHookUrl,
        title: {
          summonersName,
          summonersTag,
          error,
        },
        currentDate: `${this.getCurrentDate()}`,
      };

      if (error.response.status === 404) {
        await this.sendToWebHook(webHookInfo, '#2 not found');

        return {
          message: `리그오브레전드 아이디가 아닙니다.`,
          errorCode: error.response.status,
        };
      } else {
        await this.sendToWebHook(
          {
            url: this.ServerErrorWebHookUrl,
            title: {
              summonersName,
              summonersTag,
              error,
            },
            currentDate: `${this.getCurrentDate()}`,
          },
          'server error',
        );

        return {
          message: `서버 오류.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
      }
    }

    const summonersEncryptedId = responseBySummonersPuuid.data.id;

    const GetSummonersInfoUrl = `${this.RiotBaseUrlKr}/lol/league/v4/entries/by-summoner/${summonersEncryptedId}?api_key=${this.RiotAppKey}`;

    try {
      var responseBySummonersEncryptedId = await this.httpService
        .get(GetSummonersInfoUrl)
        .toPromise();
    } catch (error) {
      console.log('소환사 정보 검색 에러: ', error.response.status);

      const webHookInfo = {
        url: this.SummonerErrorWebHookUrl,
        title: {
          summonersName,
          summonersTag,
          error,
        },
        currentDate: `${this.getCurrentDate()}`,
      };

      if (error.response.status === 404) {
        await this.sendToWebHook(webHookInfo, '#3 not found');

        return {
          message: `소환사 정보가 존재하지 않습니다.`,
          errorCode: error.response.status,
        };
      } else {
        await this.sendToWebHook(
          {
            url: this.ServerErrorWebHookUrl,
            title: {
              summonersName,
              summonersTag,
              error,
            },
            currentDate: `${this.getCurrentDate()}`,
          },
          'server error',
        );

        return {
          message: `서버 오류.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
      }
    }

    const webHookInfo = {
      url: this.SummonerSuccessWebHookUrl,
      title: {
        summonersName,
        summonersTag,
      },
      currentDate: `${this.getCurrentDate()}`,
    };

    await this.sendToWebHook(webHookInfo, 'summoner OK');

    const summonersInfo = responseBySummonersEncryptedId.data;

    return { summonersEncryptedId, summonersInfo };
  }

  async getSummonersStatus(body): Promise<any> {
    const { summonersName, summonersTag, summonersEncryptedId } = body;

    const GetStartGameTimeUrl = `${this.RiotBaseUrlKr}/lol/spectator/v4/active-games/by-summoner/${summonersEncryptedId}?api_key=${this.RiotAppKey}`;

    try {
      const responseBySummonersId = await this.httpService
        .get(GetStartGameTimeUrl)
        .toPromise();

      /** (주의) 이거 epochTime 임 */
      const gameStartTime = responseBySummonersId.data.gameStartTime;

      const currentEpochTime = new Date().getTime();

      if (currentEpochTime > gameStartTime + 30000 + 180000) {
        await this.sendToWebHook(
          {
            url: this.ServerErrorWebHookUrl,
            title: {
              summonersName,
              summonersTag,
            },
            currentDate: `${this.getCurrentDate()}`,
          },
          '#4 forbiden',
        );
        return {
          message: `게임 시작 3분이 경과되어<br>조회가 불가능합니다.`,
          errorCode: 403.1,
        };
      }
    } catch (error) {
      console.log('인게임 검색 에러: ', error.response.status);

      const webHookInfo = {
        url: this.IngameErrorWebHookUrl,
        title: {
          summonersName,
          summonersTag,
          error,
        },
        currentDate: `${this.getCurrentDate()}`,
      };

      if (error.response.status === 404) {
        await this.sendToWebHook(webHookInfo, '#4 not found');
        return {
          message: `'${summonersName}'<br>님은 현재 게임중이 아닙니다.`,
          errorCode: error.response.status,
        };
      } else {
        await this.sendToWebHook(
          {
            url: this.ServerErrorWebHookUrl,
            title: {
              summonersName,
              summonersTag,
              error,
            },
            currentDate: `${this.getCurrentDate()}`,
          },
          'server error',
        );

        return {
          message: `서버 오류.<br>(code: ${error.response.status})`,
          errorCode: error.response.status,
        };
      }
    }

    /** API fetch 딜레이 */
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    /** 게임 시작 시간 담는 배열 */
    let startTimeList = [];

    /** 실제 게임 시작 시간 배열 인덱스 */
    let currentStartTimeIndex = 0;

    /** 라이엇 인게임 조회 횟수 */
    let fetchCount = 0;

    do {
      if (fetchCount >= 1) await delay(10000);
      else {
        const webHookInfo = {
          url: this.IngameSuccessWebHookUrl,
          title: {
            summonersName,
            summonersTag,
          },
          currentDate: `${this.getCurrentDate()}`,
        };

        await this.sendToWebHook(webHookInfo, 'loading OK');

        await delay(1000);
      }

      try {
        var responseBySummonersId = await this.httpService
          .get(GetStartGameTimeUrl)
          .toPromise();
      } catch (error) {
        console.log('인게임 검색 에러: ', error.response.status);

        const webHookInfo = {
          url: this.IngameErrorWebHookUrl,
          title: {
            summonersName,
            summonersTag,
            error,
          },
          currentDate: `${this.getCurrentDate()}`,
        };

        if (error.response.status === 429) {
          await this.sendToWebHook(webHookInfo, '#5 too many request');

          return {
            message: `현재 요청자가 많아 이용이 어렵습니다.<br>ㅈㅅ`,
            errorCode: error.response.status,
          };
        } else {
          await this.sendToWebHook(
            {
              url: this.ServerErrorWebHookUrl,
              title: {
                summonersName,
                summonersTag,
                error,
              },
              currentDate: `${this.getCurrentDate()}`,
            },
            'server error',
          );

          return {
            message: `서버 오류.<br>(code: ${error.response.status})`,
            errorCode: error.response.status,
          };
        }
      }

      const gameStartTime = responseBySummonersId.data.gameStartTime;

      startTimeList.push(gameStartTime);

      // console.log('로딩중... ');
      // console.log('현재 배열: ', startTimeList);

      fetchCount++;

      /** 로딩 시간 5분 이상이면 다시 시도 */
      if (fetchCount === 30) {
        await this.sendToWebHook(
          {
            url: this.ServerErrorWebHookUrl,
            title: {
              summonersName,
              summonersTag,
            },
            currentDate: `${this.getCurrentDate()}`,
          },
          '#5 forbiden',
        );
        return {
          message: `로딩 시간이 5분 경과되어 이용이 어렵습니다.<br>(다시하기)`,
          errorCode: 403.2,
        };
      }
    } while (
      startTimeList.length === 1 ||
      startTimeList[fetchCount - 2] === startTimeList[fetchCount - 1]
    );

    const webHookInfo = {
      url: this.IngameSuccessWebHookUrl,
      title: {
        summonersName,
        summonersTag,
      },
      currentDate: `${this.getCurrentDate()}`,
    };

    await this.sendToWebHook(webHookInfo, 'start OK');

    currentStartTimeIndex = startTimeList.length - 1;

    const currentStartTime = startTimeList[currentStartTimeIndex];

    /** 인게임 딜레이 30초 추가 */
    const time = new Date(currentStartTime + 30 * 1000);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const currentEpochTime = new Date().getTime();

    const realTimeSeconds = Math.floor(
      (currentEpochTime - (currentStartTime + 30 * 1000)) / 1000,
    );

    return {
      gameStartTime: { hours, minutes, seconds },
      realTimeSeconds,
    };
  }
}
