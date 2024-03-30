import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpectateService } from './spectate.service';
import { SearchSummonerDto } from './dto/search-summoner.dto';

@Controller('api/v1.0')
export class SpectateController {
  constructor(private spectateService: SpectateService) {}

  @Post('/summoners')
  @UsePipes(ValidationPipe)
  getSummonersEncryptedId(@Body() searchSummonerDto: SearchSummonerDto) {
    return this.spectateService.getSummonersEncryptedId(searchSummonerDto);
  }

  @Post('/spectate/live')
  getLiveGameTime(@Body() Body) {
    return this.spectateService.getLiveGameTime(Body);
  }
}
