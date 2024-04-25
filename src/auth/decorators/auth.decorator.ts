import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RoleGuard } from '../guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';

export const ROLES_METADATA = 'roles-metadata';

export const RequiredAuth = (
  ...roles: ('admin' | 'moderator' | 'shop_owner' | 'factory_owner')[]
) =>
  applyDecorators(
    ApiBearerAuth(),
    roles.length > 0
      ? applyDecorators(
          SetMetadata(ROLES_METADATA, roles),
          UseGuards(AuthGuard, RoleGuard),
        )
      : UseGuards(AuthGuard),
  );
