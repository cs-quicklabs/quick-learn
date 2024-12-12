import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify allowed user type IDs for a route
 * @param allowedUserTypes Array of user type IDs allowed to access the route
 * @returns MethodDecorator & ClassDecorator
 */
export const Roles = (...allowedUserTypes: number[]) =>
  SetMetadata(ROLES_KEY, allowedUserTypes);
