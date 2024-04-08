import {
  Controller,
  Post,
  Body,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { SpectateService } from './spectate.service';
import { SpectateSummonerDto } from './dto/spectate-summoner.dto';

@Controller('api/v2.0/spectate')
export class SpectateController {
  constructor(private spectateService: SpectateService) {}

  // @Post('/v1.0/summoners')
  // @UsePipes(ValidationPipe)
  // getSummonersEncryptedId(@Body() searchSummonerDto: SearchSummonerDto) {
  //   return this.spectateService.getSummonersEncryptedId(searchSummonerDto);
  // }

  // @Post('/v1.0/spectate/live')
  // @UsePipes(ValidationPipe)
  // getLiveGameTime(@Body() spectateSummonerDto: SpectateSummonerDto) {
  //   return this.spectateService.getLiveGameTime(spectateSummonerDto);
  // }

  @Post('/status')
  @UsePipes(ValidationPipe)
  getCurrentGameStatusHandler(
    @Body() spectateSummonerDto: SpectateSummonerDto,
    @Res() res: Response,
  ) {
    return this.spectateService.getCurrentGameStatus(spectateSummonerDto, res);
  }

  @Post('/live')
  @UsePipes(ValidationPipe)
  getCurrentGameHandler(
    @Body() spectateSummonerDto: SpectateSummonerDto,
    @Res() res: Response,
  ) {
    return this.spectateService.getCurrentGame(spectateSummonerDto, res);
  }
}
