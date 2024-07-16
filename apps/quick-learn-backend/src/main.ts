import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger';
import { EnvironmentEnum } from './common/constants/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/`
  );
}

bootstrap();
