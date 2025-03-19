import { Entities } from '@src/entities';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE || 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port:
    process.env.DATABASE_PORT || '5432'
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
  username: process.env.DATABASE_USERNAME || 'ujjwalsai',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'quickquickquick',
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.DATABASE_LOG === 'true',
  entities: [...Entities],
  autoLoadEntities: true,
  subscribers: [__dirname + '/../**/*.subscriber{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/1742364731131-migration.ts'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'subscriber',
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_ENABLED === 'true' &&
      process.env.DATABASE_HOST !== 'localhost'
        ? {
            rejectUnauthorized:
              process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
            ca: process.env.DATABASE_CA ?? undefined,
            key: process.env.DATABASE_KEY ?? undefined,
            cert: process.env.DATABASE_CERT ?? undefined,
          }
        : undefined,
  },
} as DataSourceOptions);
