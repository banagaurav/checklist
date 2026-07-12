import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { getCommonLoginPayload } from '../utils';
function queryOrHeaderExtractor(req) {
  let token = null;
  if (req && req.query && req.query.token) {
    token = req.query['token'];
  } else {
    token = req.headers.authorization;
    if (token) {
      token = token.split('Bearer ').pop();
    }
  }
  return token;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: queryOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOne(payload.userId);

    const pLoad = getCommonLoginPayload(payload);

    /**
     * If the SysAdmin is using the impersonate, then skip the 2FA
     */
    if (payload.shouldIgnoreTwoFactorAuthentication) {
      return pLoad;
    }

    /**
     * If the 2fa is not enabled
     */
    if (!user.isTwoFactorAuthenticationEnabled) {
      return pLoad;
    }
    if (payload.isTwoFactorAuthenticated) {
      return pLoad;
    }
    return pLoad;
  }
}
