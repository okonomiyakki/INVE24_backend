import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpectateService } from './spectate.service';
import { SearchSummonerDto } from './dto/search-summoner.dto';

@Controller('spectate')
export class SpectateController {
  constructor(private spectateService: SpectateService) {}

  @Post()
  @UsePipes(ValidationPipe)
  getSummonersEncryptedId(@Body() searchSummonerDto: SearchSummonerDto) {
    return this.spectateService.getSummonersEncryptedId(searchSummonerDto);
  }

  @Post('/live')
  getLiveGameTime(@Body() Body) {
    return this.spectateService.getLiveGameTime(Body);
  }
}
