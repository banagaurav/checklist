import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class VerifyTokenDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @ApiProperty()
  @IsOptional()
  password: string;
}
