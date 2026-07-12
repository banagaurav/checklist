import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Role, roleIsAtLeast } from '../types';

@Injectable()
export class SameOrgGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const organisationId = request.body?.organisationId || request.query?.organisationId;

    if (user.role === Role.SYSADMIN) {
      return true;
    }

    if (roleIsAtLeast(user.role, Role.ADMIN)) {
      return user.orgId === organisationId || user.organisationId == organisationId;
    }

    if (roleIsAtLeast(user.role, Role.STAFF)) {
      return user.orgId === organisationId || user.organisationId == organisationId;
    }

    return false;
  }
}
