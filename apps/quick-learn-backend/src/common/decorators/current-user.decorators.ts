import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '@src/entities/user.entity';

type UserRecord = keyof UserEntity;

export const CurrentUser = createParamDecorator(
  (data: UserRecord, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
  },
);
