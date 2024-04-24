import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesService } from 'src/roles/roles.service';
import { ROLES_METADATA } from '../decorators/auth.decorator';
import { User } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger('RoleGuard');

  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_METADATA,
      [context.getHandler(), context.getClass()],
    );

    console.log(requiredRoles);

    if (!requiredRoles) {
      this.logger.verbose('roles dont specified');
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request['user'] as User;

    const userRole = await this.rolesService.findOne(user.roleId);

    this.logger.verbose('checking role permissions', {
      requiredRoles,
      userRole: userRole.name,
    });
    return requiredRoles.includes(userRole.name);
  }
}