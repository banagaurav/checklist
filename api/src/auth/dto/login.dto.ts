import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The email',
  })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'The Password',
  })
  readonly password: string;
}
