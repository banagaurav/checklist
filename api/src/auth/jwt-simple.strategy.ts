import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
export class JwtSimpleStrategy extends PassportStrategy(
  Strategy,
  'jwt-simple',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: queryOrHeaderExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: any) {
    return getCommonLoginPayload(payload);
  }
}
