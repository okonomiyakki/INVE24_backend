import { Controller, Post, Body } from '@nestjs/common';
import { LolService } from './lol.service';

@Controller('lol')
export class LolController {
  constructor(private lolService: LolService) {}

  @Post()
  getSummonersEncryptedId(@Body() Body) {
    return this.lolService.getSummonersEncryptedId(Body);
  }
}
