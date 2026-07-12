import { IsEmail, IsNotEmpty } from 'class-validator';

export class ImpersonateDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
