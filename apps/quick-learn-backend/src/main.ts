import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger';
import { EnvironmentEnum } from './common/constants/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://example.com',
      'http://www.example.com',
      'http://app.example.com',
      'https://example.com',
      'https://www.example.com',
      'https://app.example.com',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  });
  // enanbling API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // API Prefix
  // const globalPrefix = 'api';
  // app.setGlobalPrefix(globalPrefix);

  const env = process.env.ENV || EnvironmentEnum.Developemnt;

  if (env !== EnvironmentEnum.Production) {
    setupSwagger(app);
  }

  const port = process.env.PORT || 3001;

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
