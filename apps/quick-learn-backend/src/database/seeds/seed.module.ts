import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { UserTypeModule } from './user-type/user-type.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from '../config/database.config';
import appConfig from '@src/config/app.config';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';

@Module({
  imports: [
    TeamModule,

    UserModule,
    UserTypeModule,
    TeamModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: '.env.dev', // TODO: Need to remove and use the env from the project.json
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
