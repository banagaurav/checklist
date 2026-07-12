import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SetPasswordDto } from './dto/set-passord.dto';
import { Response } from 'express';
import { TokenType } from '../types';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { Role, UserRequest } from '../common/types';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ImpersonateDto } from './dto/impersonate.dto';
import { ResendInviteDto } from './dto/resendInvite.dto';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-auth-code.dto';
import { JwtSimpleAuthGuard } from '../common/guards/jwt-simple-auth.guard';
import { DeleteUserDto } from './dto/delete-user.dto';
import cnsl from 'src/utils/cnsl';
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ description: 'Login' })
  @HttpCode(200)
  async login(@Req() req: UserRequest, @Body() loginDto: LoginUserDto) {
    cnsl.json('loginDto', loginDto);
    cnsl.json('req.user', req.user);
    const b = loginDto;
cnsl.log("process.env.JWT_KEY",process.env.JWT_KEY)
    return this.authService.login(req.user, b);
  }

  @Post('impersonate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SYSADMIN)
  @HttpCode(200)
  async impersonate(@Body() impersonateDto: ImpersonateDto) {
    return this.authService.impersonate(impersonateDto);
  }

  @Post('/resend-invitation')
  @ApiOperation({ description: 'Resend Invitation Email' })
  @HttpCode(200)
  async resendInvitationEmail(@Body() payload: ResendInviteDto) {
    const { email } = payload;
    return this.userService.resendInvitationEmail(email);
  }

  @Post('/verify')
  @HttpCode(200)
  async verifyToken(@Body() verifyTokenPayload: VerifyTokenDto) {
    const { token } = verifyTokenPayload;
    const user = await this.userService.verifyInviteToken(token);

    if (!user) throw new BadRequestException('Invalid token or token expired');

    return {
      email: user.email,
      id: user.id,
      token,
      type: TokenType.INVITE,
    };
  }

  @Post('/forgot')
  @HttpCode(200)
  async forgot(
    @Body() forgotPayload: ForgotPasswordDto,
    @Res() response: Response,
  ) {
    const { email } = forgotPayload;
    const user = await this.userService.sendTempRecoveryCodeEmail(email);

    if (!user)
      throw new BadRequestException("Couldn't find user with provided email");

    response.status(HttpStatus.OK).send();
  }

  @Post('/verify-code')
  @HttpCode(200)
  async verifyRecoveryCode(@Body() verifyCodePayload: VerifyCodeDto) {
    const { email, code } = verifyCodePayload;
    const user = await this.userService.verifyRecoveryCode(email, code);

    if (!user) throw new BadRequestException('Invalid code or code expired');

    return {
      email: user.email,
      id: user.id,
      token: code,
      type: TokenType.RECOVERY,
    };
  }

  @Post('/password')
  @HttpCode(200)
  async setPassword(
    @Body() setPasswordPayload: SetPasswordDto,
    @Res() response: Response,
  ) {
    const { email, token, password, type } = setPasswordPayload;
    const user = await this.userService.setPassword(
      email,
      password,
      token,
      type,
    );

    if (!user)
      throw new BadRequestException("Couldn't find user with provided email");

    response.status(HttpStatus.OK).send();
  }

  @Post('/verify-password')
  // @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    Role.SYSADMIN,
  )
  async verifyPassword(
    @Body() verifyPasswordPayload: { password: string },
    @Req() req: UserRequest,
  ) {
    const { password } = verifyPasswordPayload;
    const { user: loggedInUser } = req;
    return this.userService.verifyPassword(password, loggedInUser);
  }

  @Patch('delete')
  @ApiOperation({ description: 'Delete user profile' })
  async deleteUserByEmailPwd(@Body() deleteUserDto: DeleteUserDto) {
    return this.authService.deleteProfile(deleteUserDto);
    // return 'OK';
    // return this.userService.resendInvitationEmail(user.email);
  }

  @Post('2fa/turn-on')
  @HttpCode(200)
  @UseGuards(JwtSimpleAuthGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: UserRequest,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnOffTwoFactorAuthentication(
      request.user.userId,
      true,
    );
  }

  @Post('2fa/turn-off')
  @HttpCode(200)
  @UseGuards(JwtSimpleAuthGuard)
  async turnOffTwoFactorAuthentication(@Req() request: UserRequest) {
    await this.userService.turnOnOffTwoFactorAuthentication(
      request.user.userId,
      false,
    );
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtSimpleAuthGuard)
  async authenticate(
    @Req() request: UserRequest,
    @Body() twoFactorAuthenticationCodeDto: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid =
      await this.authService.isTwoFactorAuthenticationCodeValid(
        twoFactorAuthenticationCodeDto.twoFactorAuthenticationCode,
        request.user,
      );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginWith2fa(request.user);
  }
}
