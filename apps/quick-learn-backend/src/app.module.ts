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
  RoadmapModule,
  CourseModule,
} from './routes';
import { FileModule } from './file/file.module';
import fileConfig from './file/config/file.config';
import authConfig from './routes/auth/config/auth.config';
import { MetadataModule } from './routes/metadata/metadata.module';

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
    MetadataModule,
    FileModule,
    UsersModule,
    AuthModule,
    TeamModule,
    ProfileModule,
    SkillsModule,
    CourseCategoriesModule,
    RoadmapCategoriesModule,
    RoadmapModule,
    CourseModule,
  ],
})
export class AppModule {}
