import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { NotifierModule } from 'src/notifier/notifier.module';

@Module({
  imports: [HttpModule, NotifierModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
