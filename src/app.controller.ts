import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private readonly config: ConfigService) {}

  private HostBaseUrl = this.config.get('HOST_BASE_URL');
  private RiotBaseUrlAuth = this.config.get('RIOT_BASE_URL_AUTH');
  private DiscordInvitationCode = this.config.get('DISCORD_INVITATION_CODE');

  @Get()
  @Render('main')
  main() {
    return {
      data: {
        HostBaseUrl: this.HostBaseUrl,
        RiotBaseUrlAuth: this.RiotBaseUrlAuth,
        HostPrivacyUrl: 'https://inve24.imweb.me/?mode=privacy',
        HostAgreementUrl: 'https://inve24.imweb.me/?mode=policy',
        DiscordInvitationCode: this.DiscordInvitationCode,
      },
    };
  }

  @Get('/summoners')
  @Render('summoners')
  summoners() {
    return {
      data: {
        HostBaseUrl: this.HostBaseUrl,
        HostPrivacyUrl: 'https://inve24.imweb.me/?mode=privacy',
        HostAgreementUrl: 'https://inve24.imweb.me/?mode=policy',
        DiscordInvitationCode: this.DiscordInvitationCode,
      },
    };
  }

  @Get('/summoners/spectate/live')
  @Render('timer')
  timer() {
    return {
      data: {
        HostBaseUrl: this.HostBaseUrl,
        HostPrivacyUrl: 'https://inve24.imweb.me/?mode=privacy',
        HostAgreementUrl: 'https://inve24.imweb.me/?mode=policy',
        DiscordInvitationCode: this.DiscordInvitationCode,
      },
    };
  }
}
