import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Role } from '../types';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly storage: FileStorageService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    if (user.role === Role.SYSADMIN || user.role === Role.ADMIN) {
      return true;
    }

    const userPermissions = user.permissions;
    if (userPermissions && Array.isArray(userPermissions)) {
      if (userPermissions.length > 0) {
        return requiredPermissions.some((p) => userPermissions.includes(p));
      }
      return true;
    }

    const roleId = user.roleId;
    if (!roleId) {
      return true;
    }

    const roles = this.storage.findAll<any>('roles');
    const role = roles.find((r: any) => r.id === roleId);
    if (!role) {
      return true;
    }

    const rolePermissions = role.permissions || [];
    if (rolePermissions.length === 0) {
      return true;
    }

    return requiredPermissions.some((p) => rolePermissions.includes(p));
  }
}
