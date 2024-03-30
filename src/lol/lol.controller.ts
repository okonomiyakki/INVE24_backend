import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LolService } from './lol.service';
import { SearchSummonerDto } from './dto/search-summoner.dto';

@Controller('lol')
export class LolController {
  constructor(private lolService: LolService) {}

  @Post()
  @UsePipes(ValidationPipe)
  getSummonersEncryptedId(@Body() searchSummonerDto: SearchSummonerDto) {
    return this.lolService.getSummonersEncryptedId(searchSummonerDto);
  }

  @Post('/status')
  getSummonersStatus(@Body() Body) {
    return this.lolService.getSummonersStatus(Body);
  }
}
