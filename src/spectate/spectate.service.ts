import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { NotifierService } from '../notifier/notifier.service';
import { SpectateSummonerDto } from './dto/spectate-summoner.dto';

@Injectable()
export class SpectateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly notifierService: NotifierService,
  ) {}

  private RiotBaseUrlAsia = this.config.get('RIOT_BASE_URL_ASIA');
  private RiotBaseUrlKr = this.config.get('RIOT_BASE_URL_KR');
  private RiotAppKey = this.config.get('RIOT_API_APP_KEY');

  private DEFAULT_DELAY = this.config.get('LOL_DEFAULT_DELAY');
  private INGAME_DELAY = this.config.get('LOL_INGAME_DELAY');
  private LOADING_DELAY = this.config.get('LOL_LOADING_DELAY');

  async getCurrentGameStatus(
    spectateSummonerDto: SpectateSummonerDto,
    res: Response,
  ): Promise<any> {
    const { summonerName, summonerTag, encryptedPUUID } = spectateSummonerDto;

    const GetCurrentGameUrl = `${this.RiotBaseUrlKr}/lol/spectator/v5/active-games/by-summoner/${encryptedPUUID}?api_key=${this.RiotAppKey}`;

    try {
      const currentGameResponse = await this.httpService
        .get(GetCurrentGameUrl)
        .toPromise();

      /** (주의) 이거 epochTime 임 */
      const { gameStartTime } = currentGameResponse.data;

      const currentEpochTime = new Date().getTime();

      //+parseInt(this.DEFAULT_DELAY)
      if (currentEpochTime > gameStartTime + parseInt(this.INGAME_DELAY)) {
        const webHookInfo = {
          title: {
            summonerName,
            summonerTag,
          },
        };

        await this.notifierService.sendToWebHook(webHookInfo, '#4 forbiden');

        return res.status(403).json({
          status: 'fail',
          message: `${summonerName}님이 현재 참여하신 게임은 이미 시작되었습니다.`,
        });
      }

      const time = new Date(gameStartTime + parseInt(this.LOADING_DELAY));

      const hours = time.getHours();
      const minutes = time.getMinutes();
      const seconds = time.getSeconds();

      return res.status(200).json({
        status: 'success',
        message: `BanPick Complete.`,
        data: { gameStartTime: { hours, minutes, seconds } },
      });
    } catch (error) {
      const webHookInfo = {
        title: {
          summonerName,
          summonerTag,
          error,
        },
      };

      if (error.response.status === 404) {
        await this.notifierService.sendToWebHook(webHookInfo, '#4 not found');

        return res.status(404).json({
          status: 'error',
          message: `'${summonerName}'<br>님은 현재 게임중이 아닙니다.`,
        });
      } else {
        await this.notifierService.sendToWebHook(webHookInfo, 'server error');

        return res.status(error.response.status).json({
          status: 'error',
          message: `RIOT Server Error. (code: ${error.response.status})`,
        });
      }
    }
  }

  async getCurrentGame(
    spectateSummonerDto: SpectateSummonerDto,
    res: Response,
  ): Promise<any> {
    const { summonerName, summonerTag, encryptedPUUID } = spectateSummonerDto;

    const GetCurrentGameUrl = `${this.RiotBaseUrlKr}/lol/spectator/v5/active-games/by-summoner/${encryptedPUUID}?api_key=${this.RiotAppKey}`;

    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    let startTimeList = [];

    let fetchCount = 0;

    do {
      if (fetchCount >= 1) await delay(10000);
      else {
        const webHookInfo = {
          title: {
            summonerName,
            summonerTag,
          },
        };

        await this.notifierService.sendToWebHook(webHookInfo, 'loading OK');

        await delay(1000);
      }

      try {
        var currentGameResponse = await this.httpService
          .get(GetCurrentGameUrl)
          .toPromise();
      } catch (error) {
        const webHookInfo = {
          title: {
            summonerName,
            summonerTag,
            error,
          },
        };

        if (error.response.status === 429) {
          await this.notifierService.sendToWebHook(
            webHookInfo,
            '#5 too many request',
          );

          return res.status(429).json({
            status: 'error',
            message: `현재 INVE24 서버가 혼잡하여 이용이 불가능합니다. 잠시 후에 다시 시도해 주세요.`,
          });
        } else if (error.response.status === 504) {
          await this.notifierService.sendToWebHook(webHookInfo, 'server error');

          console.log(error);

          return res.status(504).json({
            status: 'error',
            message: `RIOT Server Gateway timeout : 현재 게임이 시작되었지만, 라이엇 서버로부터 게임 시작 정보를 받아올 수 없습니다.`,
          });
        } else {
          await this.notifierService.sendToWebHook(webHookInfo, 'server error');

          return res.status(error.response.status).json({
            status: 'error',
            message: `RIOT Server Error. (code: ${error.response.status})`,
          });
        }
      }

      const { gameStartTime } = currentGameResponse.data;

      startTimeList.push(gameStartTime);

      fetchCount++;

      const webHookInfo = {
        title: {
          summonerName,
          summonerTag,
        },
      };

      /** 로딩 시간 5분 이상이면 다시 시도 */
      if (fetchCount === 30) {
        await this.notifierService.sendToWebHook(webHookInfo, '#5 forbiden');

        return res.status(400).json({
          status: 'error',
          message: `${summonerName}님이 현재 참여하신 게임의 로딩 시간이 5분 경과되었습니다. 로딩이 5분 이상 진행된 게임은 서비스하지 않습니다. 이전 화면으로 돌아갑니다.`,
        });
      }
    } while (
      startTimeList.length === 1 ||
      startTimeList[fetchCount - 2] === startTimeList[fetchCount - 1]
    );

    const webHookInfo = {
      title: {
        summonerName,
        summonerTag,
      },
    };

    await this.notifierService.sendToWebHook(webHookInfo, 'start OK');

    const currentStartTime = startTimeList[startTimeList.length - 1];

    const time = new Date(currentStartTime + parseInt(this.INGAME_DELAY));

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const currentEpochTime = new Date().getTime();

    const realTimeSeconds = Math.floor(
      (currentEpochTime - (currentStartTime + parseInt(this.INGAME_DELAY))) /
        1000,
    );

    return res.status(200).json({
      status: 'success',
      message: `Loading Complete`,
      data: { gameStartTime: { hours, minutes, seconds }, realTimeSeconds },
    });
  }
}
