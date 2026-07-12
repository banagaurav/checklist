import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendInviteDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
