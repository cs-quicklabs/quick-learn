import { registerAs } from '@nestjs/config';
import validateConfig from '@src/common/utils/validate-config';

import { IsString } from 'class-validator';
import { AuthConfig } from './auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  JWT_SECRET_KEY: string;

  @IsString()
  JWT_EXPIRY_TIME: string;

  @IsString()
  JWT_REFRESH_SECRET_KEY: string;

  @IsString()
  JWT_REFRESH_EXPIRY_TIME: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.JWT_SECRET_KEY,
    expires: process.env.JWT_EXPIRY_TIME,
    refreshSecret: process.env.JWT_REFRESH_SECRET_KEY,
    refreshExpires: process.env.JWT_REFRESH_EXPIRY_TIME,
  };
});
