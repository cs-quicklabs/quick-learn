import { registerAs } from '@nestjs/config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { AppConfig } from './app-config';
import { EnvironmentEnum } from '@src/common/constants/constants';
import validateConfig from '@src/common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsEnum(EnvironmentEnum)
  @IsOptional()
  ENV: EnvironmentEnum;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  SMTP_EMAIL: string;

  @IsString()
  @IsOptional()
  SMTP_HOST: string;

  @IsString()
  @IsOptional()
  SMTP_PORT: string;

  @IsString()
  @IsOptional()
  SMTP_USER: string;

  @IsString()
  @IsOptional()
  SMTP_PASS: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    env: process.env.NODE_ENV || EnvironmentEnum.Developemnt,
    name: process.env.APP_NAME || 'Quick Learn',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN ?? 'http://localhost:3000',
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    smtpEmail: process.env.SMTP_EMAIL,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
  };
});
