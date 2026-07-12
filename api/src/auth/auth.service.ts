import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { Role, UserRequest } from '../common/types';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { isEmpty } from 'lodash';
import { isNotEmpty } from 'class-validator';
import { getCommonLoginPayload } from '../utils';
import cnsl from 'src/utils/cnsl';
import { LoggedInUser } from 'src/types';
import { FileStorageService } from '../common/file-storage/file-storage.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private readonly storage: FileStorageService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);

    if (user && !user.isVerified) {
      throw new ForbiddenException('User is not verified!');
    }
    if (user && !user.passwordHash) {
      throw new ForbiddenException('User is not verified!');
    }
    if (user && user.passwordHash && user.validatePassword(pass)) {
      return user;
    }

    throw new UnauthorizedException('Invalid login credentials.');
  }

  async login(user, loginDto) {
    if (!user.isVerified) {
      throw new ForbiddenException('User is not verified!');
    }
    if (!user.isActive) {
      throw new ForbiddenException('No user found or User is deleted!');
    }
    let scope = {};
    if (loginDto.scope) {
      scope = loginDto.scope;
    }
    const loginUser = await this.getPayload(user, scope);
    return loginUser;
  }

  async impersonate(impersonateDto: { email: string }) {
    const { email } = impersonateDto;

    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Invalid user!');
    }

    if (!user.isActive) {
      throw new ForbiddenException('No user found or User is deleted!');
    }

    user = user.toJSON() as User;

    const scope = {};

    user.shouldIgnoreTwoFactorAuthentication = true;
    return await this.getPayload(user, scope);
  }

  async getPayload(user: User, scope?: any) {
    const payload = await this.getRawPayload(user, scope);
    const token = this.jwtService.sign(payload);
    return {
      accessToken: token,
      token,
      userId: user.id,
      role: user.role,
      roleId: user.roleId,
      organisationId: user.organisationId,
    };
  }

  async getRawPayload(user: User, scope?: any) {
    let subId: number;

    let permissions: string[] = [];
    if (user.roleId) {
      const roles = this.storage.findAll<any>('roles');
      const role = roles.find((r: any) => r.id === user.roleId);
      if (role) {
        permissions = role.permissions || [];
      }
    } else if (user.role !== Role.SYSADMIN && user.role !== Role.CUSTOMER && user.role !== Role.CLIENT) {
      const roleName = user.role.charAt(0) + user.role.slice(1).toLowerCase();
      const roles = this.storage.findAll<any>('roles');
      const role = roles.find((r: any) => r.name === roleName && (!user.organisationId || r.organisationId === user.organisationId));
      if (role) {
        permissions = role.permissions || [];
      }
    }

    const organisations = this.storage.findAll<any>('organisations');
    const organisation = organisations.find((o: any) => o.id === user.organisationId);

    const payload: any = {
      subId,
      scope,
      fullName: user.fullName,
      username: user.email,
      sub: user.id,
      userId: user.id,
      role: user.role,
      roleId: user.roleId,
      organisationId: user.organisationId,
      orgName: organisation?.name,
      orgTheme: organisation?.themeConfig,
      preferences: user.preferences,
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
      permissions,
    };

    cnsl.json("payload", payload);

    if (user.shouldIgnoreTwoFactorAuthentication) {
      payload['shouldIgnoreTwoFactorAuthentication'] = true;
    }
    return payload;
  }

  async generateTwoFactorAuthenticationSecret(user: UserRequest) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user['username'],
      'Factory',
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(
      secret,
      user['userId'],
    );

    return {
      secret,
      otpauthUrl,
    };
  }

  public async deleteProfile(deleteUserDto: { email: string; password: string }) {
    const { email, password } = deleteUserDto;

    try {
      const user = await this.usersService.findOneByEmail(email);

      if (user && !user.passwordHash) {
        throw new ForbiddenException('User is not verified!');
      }
      if (user && user.passwordHash && user.validatePassword(password)) {
        const userPayload = await this.getRawPayload(user);
        return this.usersService.remove(user.id, userPayload);
      } else {
        throw new UnauthorizedException('Invalid login credentials.');
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getQrCodeBase64(otpauthUrl: string) {
    return toDataURL(otpauthUrl);
  }

  public async isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    loggedInUser: LoggedInUser,
  ) {
    const user = await this.usersService.findOne(loggedInUser.userId);

    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  async loginWith2fa(loggedInUser: LoggedInUser) {
    const user = await this.usersService.findOne(loggedInUser.userId);

    const payload = {
      email: loggedInUser.username,
      isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
      isTwoFactorAuthenticated: true,
      ...getCommonLoginPayload(loggedInUser),
    };

    return {
      email: payload.email,
      token: this.jwtService.sign(payload),
      payload,
    };
  }
}
