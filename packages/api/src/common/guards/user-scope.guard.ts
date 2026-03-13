import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { SCOPE_KEY } from 'src/common/decorators/user-scope.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { ScopeInput, deserializeScopeMask, hasScopes } from 'src/common/scope/scope.bitmask';

@Injectable()
export class UserScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<ScopeInput>(SCOPE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required || Object.keys(required).length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req as { user?: { role?: string; scope?: unknown } };

    if (!user) {
      throw new UnauthorizedException('Користувач не авторизований');
    }

    if (user.role === UserRole.ADMIN) {
      return true;
    }

    const rawScope = typeof user.scope === 'string' ? user.scope : undefined;
    const userMask = deserializeScopeMask(rawScope);

    if (!hasScopes(userMask, required)) {
      throw new ForbiddenException('Недостатньо повноважень для виконання цієї дії');
    }

    return true;
  }
}
