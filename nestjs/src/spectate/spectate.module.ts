import { Module } from '@nestjs/common';
import { SpectateController } from './spectate.controller';
import { SpectateService } from './spectate.service';
import { HttpModule } from '@nestjs/axios';
import { NotifierModule } from '../notifier/notifier.module';

@Module({
  imports: [HttpModule, NotifierModule],
  controllers: [SpectateController],
  providers: [SpectateService],
})
export class SpectateModule {}
