import { IsNotEmpty } from 'class-validator';

export class RiotAccessPermissionCodeDto {
  @IsNotEmpty()
  code: string;
}
