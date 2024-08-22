import { DatabaseConfig } from 'src/database/config/database-config.type';
import { AppConfig } from './app-config';
import { FileConfig } from '@src/file/config/file-config.type';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  file: FileConfig;
};
