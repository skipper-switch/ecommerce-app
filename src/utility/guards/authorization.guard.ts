import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles =
      this.reflector.get<string[]>('allowedRoles', context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();
    const userRoles = request?.currentUser?.roles;

    if (!userRoles || !Array.isArray(userRoles)) {
      throw new UnauthorizedException('No roles found for the current user.');
    }

    const isAuthorized = userRoles.some((role: string) =>
      allowedRoles.includes(role),
    );

    if (!isAuthorized) {
      throw new UnauthorizedException('Sorry, you are not authorized.');
    }

    return true;
  }
}
