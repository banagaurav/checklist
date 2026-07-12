import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtSimpleAuthGuard extends AuthGuard('jwt-simple') {}
