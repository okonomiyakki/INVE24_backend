import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpectateService } from './spectate.service';
import { SearchSummonerDto } from './dto/search-summoner.dto';
import { SpectateSummonerDto } from './dto/spectate-summoner.dto';

@Controller('api')
export class SpectateController {
  constructor(private spectateService: SpectateService) {}

  @Post('/v1.0/summoners')
  @UsePipes(ValidationPipe)
  getSummonersEncryptedId(@Body() searchSummonerDto: SearchSummonerDto) {
    return this.spectateService.getSummonersEncryptedId(searchSummonerDto);
  }

  @Post('/v1.0/spectate/live')
  @UsePipes(ValidationPipe)
  getLiveGameTime(@Body() spectateSummonerDto: SpectateSummonerDto) {
    return this.spectateService.getLiveGameTime(spectateSummonerDto);
  }
}
