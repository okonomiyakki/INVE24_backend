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

  @Get('/v1.0/oauth')
  getClientId() {
    return this.authService.getClientId();
  }

  @Get('/v1.0/oauth/login')
  @UsePipes(ValidationPipe)
  rsoLogin(@Query() riotAccessPermissionCodeDto: RiotAccessPermissionCodeDto) {
    return this.authService.rsoLogin(riotAccessPermissionCodeDto);
  }
}
