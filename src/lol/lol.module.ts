import { Module } from '@nestjs/common';
import { LolController } from './lol.controller';
import { LolService } from './lol.service';

@Module({
  controllers: [LolController],
  providers: [LolService]
})
export class LolModule {}
