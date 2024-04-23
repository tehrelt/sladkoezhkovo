import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

export const User = createParamDecorator(
  (key: keyof UserModel, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    return key ? user[key] : user;
  },
);
