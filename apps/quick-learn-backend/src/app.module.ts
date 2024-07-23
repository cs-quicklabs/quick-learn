import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import appConfig from './config/app.config';
<<<<<<< HEAD
import {
  AuthModule,
  HealthCheckModule,
  ProfileModule,
  UsersModule,
} from './routes';
=======
import { HealthCheckModule, UsersModule } from './routes';
>>>>>>> 71ee2d5 (seting entities and defining endpoints)

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    HealthCheckModule,
    UsersModule,
<<<<<<< HEAD
    AuthModule,
    ProfileModule,
=======
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
  ],
})
export class AppModule {}
