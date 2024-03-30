import { Module } from '@nestjs/common';
import { LolController } from './lol.controller';
import { LolService } from './lol.service';
import { HttpModule } from '@nestjs/axios';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [HttpModule, NotificationModule],
  controllers: [LolController],
  providers: [LolService],
})
export class LolModule {}
