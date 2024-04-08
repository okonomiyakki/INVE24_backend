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
      case 'server error':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 서버 오류.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case '#1 forbiden':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 이름 및 태그를 모두 입력해 주세요.`;
        url = this.SummonerErrorWebHookUrl;
        break;
      case '#1 bad request':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 잘못된 입력 형식입니다.`;
        url = this.SummonerErrorWebHookUrl;
        break;
      case '#1 not found':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 존재하지 않는 아이디입니다.`;
        url = this.SummonerErrorWebHookUrl;
        break;
      case '#2 not found':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}.
[${webHookInfo.title.error.response.status}] 리그오브레전드 아이디가 아닙니다`;
        url = this.SummonerErrorWebHookUrl;
        break;
      case '#3 not found':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 소환사 정보가 존재하지 않습니다.`;
        url = this.SummonerErrorWebHookUrl;
        break;
      case 'summoner OK':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}`;
        url = this.SummonerSuccessWebHookUrl;
        break;
      case '#4 forbiden':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[403.1] 게임 시작 3분이 경과되어 조회가 불가능합니다.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case '#4 not found':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 현재 게임중이 아닙니다.`;
        url = this.IngameErrorWebHookUrl;
        break;
      case '#5 too many request':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[${webHookInfo.title.error.response.status}] 현재 요청자가 많아 이용이 어렵습니다.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case 'loading OK':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
로딩중...`;
        url = this.IngameSuccessWebHookUrl;
        break;
      case '#5 forbiden':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
[403.2] 로딩 시간이 5분 경과되어 이용이 어렵습니다. 다시 시도해 주세요.`;
        url = this.ServerErrorWebHookUrl;
        break;
      case 'start OK':
        about = `${webHookInfo.title.summonerName} #${webHookInfo.title.summonerTag}
게임이 시작되었습니다.`;
        url = this.IngameSuccessWebHookUrl;
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
