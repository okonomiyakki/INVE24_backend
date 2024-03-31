import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RiotAccessPermissionCodeDto } from './dto/riot-access-permission-code.dto';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/v1.0/rso-auth/login')
  @UsePipes(ValidationPipe)
  rsoLogin(@Query() accessCode: RiotAccessPermissionCodeDto) {
    return this.authService.rsoLogin(accessCode);
  }
}
