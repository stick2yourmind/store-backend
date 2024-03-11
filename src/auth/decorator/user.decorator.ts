import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext): User => {
  const { user } = ctx.switchToHttp().getRequest();
  if (!user) {
    throw new UnauthorizedException();
  }
  return user;
});
