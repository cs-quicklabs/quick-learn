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
import { FileModule } from './file/file.module';
import fileConfig from './file/config/file.config';
import authConfig from './routes/auth/config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, appConfig, fileConfig, authConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    HealthCheckModule,
    FileModule,
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
