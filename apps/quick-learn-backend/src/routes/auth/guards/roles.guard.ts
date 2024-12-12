import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../../common/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // Bypass role check for public routes
    }

    // Get allowed user type IDs for the route
    const allowedUserTypes = this.reflector.getAllAndOverride<number[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no user types are specified, deny access
    if (!allowedUserTypes || allowedUserTypes.length === 0) {
      throw new UnauthorizedException('No user types defined for this route');
    }

    // Get the request from the execution context
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes user is attached by authentication middleware

    // Check if user's type ID is in the allowed user types
    const hasAllowedUserType = allowedUserTypes.some(
      (userType) => user?.user_type_id === userType,
    );

    if (!hasAllowedUserType) {
      throw new UnauthorizedException('Insufficient permissions');
    }

    return true;
  }
}
