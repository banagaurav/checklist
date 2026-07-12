import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
  @IsNotEmpty()
  @ApiProperty()
  twoFactorAuthenticationCode: string;
}
