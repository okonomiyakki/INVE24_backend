import { Module } from '@nestjs/common';
import { LolController } from './lol.controller';
import { LolService } from './lol.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [LolController],
  providers: [LolService],
})
export class LolModule {}
