import { DatabaseConfig } from 'src/database/config/database-config.type';
import { AppConfig } from './app-config';

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
};
