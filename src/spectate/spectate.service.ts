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
    const { summonerName, summonerTag, encryptedSummonerId } =
      spectateSummonerDto;
    console.log(spectateSummonerDto);

    const GetCurrentGameUrl = `${this.RiotBaseUrlKr}/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}?api_key=${this.RiotAppKey}`;

    try {
      const currentGameResponse = await this.httpService
        .get(GetCurrentGameUrl)
        .toPromise();

      /** (주의) 이거 epochTime 임 */
      const { gameStartTime } = currentGameResponse.data;

      const currentEpochTime = new Date().getTime();

      if (
        currentEpochTime >
        gameStartTime +
          parseInt(this.INGAME_DELAY) +
          parseInt(this.DEFAULT_DELAY)
      ) {
        const webHookInfo = {
          title: {
            summonerName,
            summonerTag,
          },
        };

        await this.notifierService.sendToWebHook(webHookInfo, '#4 forbiden');

        return res.status(403).json({
          status: 'fail',
          message: `게임 시작 후 3분이 경과되어, 조회가 불가능합니다.`,
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
    const { summonerName, summonerTag, encryptedSummonerId } =
      spectateSummonerDto;

    const GetCurrentGameUrl = `${this.RiotBaseUrlKr}/lol/spectator/v4/active-games/by-summoner/${encryptedSummonerId}?api_key=${this.RiotAppKey}`;

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
            message: `현재 요청자가 많아 이용이 어렵습니다. 잠시 후에 다시 시도해 주세요.`,
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
          message: `로딩 시간이 5분 경과되어 이용이 어렵습니다. 다시 시도해 주세요.`,
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
