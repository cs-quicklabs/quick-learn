import { registerAs } from '@nestjs/config';
import { FileConfig } from './file-config.type';
import { IsString } from 'class-validator';
import validateConfig from '@src/common/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  ACCESS_KEY_ID: string;

  @IsString()
  SECRET_ACCESS_KEY: string;

  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @IsString()
  AWS_S3_REGION: string;

  @IsString()
  AWS_Endpoint: string;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    endPoint: process.env.AWS_Endpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 5242880, // 5mb
  };
});
