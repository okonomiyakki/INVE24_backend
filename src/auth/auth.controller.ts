import {
  Controller,
  Get,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RiotAccessPermissionCodeDto } from './dto/riot-access-permission-code.dto';

@Controller('api/v1.0/oauth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  getOAuthDataHandler(@Res() res: Response) {
    return this.authService.getOAuthData(res);
  }

  @Get('/login')
  @UsePipes(ValidationPipe)
  riotSignOnUserHandler(
    @Query() riotAccessPermissionCodeDto: RiotAccessPermissionCodeDto,
    @Res() res: Response,
  ) {
    return this.authService.riotSignOnUser(riotAccessPermissionCodeDto, res);
  }
}
