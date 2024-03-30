import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, NotificationModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
