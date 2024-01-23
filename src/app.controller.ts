import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly config: ConfigService,
  ) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  private HostBaseUrl = this.config.get('HOST_BASE_URL');

  @Get()
  @Render('main')
  main() {
    return {
      data: {
        HostBaseUrl: this.HostBaseUrl,
      },
    };
  }

  @Get('/summoners')
  @Render('summoners')
  summoners() {
    return {
      data: {
        HostBaseUrl: this.HostBaseUrl,
      },
    };
  }

  @Get('/summoners/timer')
  @Render('timer')
  timer() {
    return {
      data: {
        HostBaseUrl: this.HostBaseUrl,
      },
    };
  }
}
