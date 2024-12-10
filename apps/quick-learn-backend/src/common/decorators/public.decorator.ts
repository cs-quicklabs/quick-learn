import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route as public, bypassing role-based authentication
 * @returns MethodDecorator & ClassDecorator
 */

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
