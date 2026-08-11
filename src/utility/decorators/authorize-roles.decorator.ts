import { SetMetadata } from '@nestjs/common';

export const AuthroizeRoles = (...roles: string[]) =>
  SetMetadata('allowedRoles', roles);
