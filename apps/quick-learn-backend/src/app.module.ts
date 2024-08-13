import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './database/config/database.config';
import appConfig from './config/app.config';
import {
  AuthModule,
  HealthCheckModule,
  TeamModule,
  UsersModule,
  ProfileModule,
  SkillsModule,
  CourseCategoriesModule,
  RoadmapCategoriesModule,
} from './routes';

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
    AuthModule,
    TeamModule,
    ProfileModule,
    SkillsModule,
    CourseCategoriesModule,
    RoadmapCategoriesModule,
  ],
})
export class AppModule {}
