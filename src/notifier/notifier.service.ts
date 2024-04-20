import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment-timezone';

@Injectable()
export class NotifierService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

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

  getCurrentDate() {
    const currentTime = moment()
      .tz('Asia/Seoul')
      .format('YYYY/MM/DD/ddd HH시mm분ss초');

    return currentTime;
  }

  async sendToWebHook(webHookInfo, offset: string) {
    let about = '';
    let url = '';

    switch (offset) {
      case 'login OK':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
님이 서비스에 로그인하였습니다.`;
        url = this.SummonerSuccessWebHookUrl;
        break;
      case 'loading OK':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
님의 게임이 로딩중 입니다...`;
        url = this.IngameSuccessWebHookUrl;
        break;
      case 'start OK':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
님의 게임이 시작되었습니다.`;
        url = this.IngameSuccessWebHookUrl;
        break;
      case '#4 forbiden':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
님이 현재 참여하신 게임은 이미 시작되었습니다.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case '#4 not found':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
님은 현재 게임중이 아닙니다.`;
        url = this.IngameErrorWebHookUrl;
        break;
      case '#5 too many request':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
현재 INVE24 서버가 혼잡하여 이용이 불가능합니다. 잠시 후에 다시 시도해 주세요.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case '#5 gateway timeout':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
현재 게임이 시작되었지만, 라이엇 서버로부터 게임 시작 정보를 받아올 수 없습니다.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case '#5 forbiden':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
님이 현재 참여하신 게임의 로딩 시간이 5분 경과되었습니다. 로딩이 5분 이상 진행된 게임은 서비스하지 않습니다.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case 'server error':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 서버 오류.`;
        url = this.ServerErrorWebHookUrl;
        break;
    }

    const contents = {
      embeds: [
        {
          title: about,
          description: `${this.getCurrentDate()}`,
          color: 3447003,
        },
      ],
    };

    await this.httpService.post(url, contents).toPromise();
  }
}
