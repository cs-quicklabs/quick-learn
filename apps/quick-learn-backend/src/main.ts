import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger';
import { EnvironmentEnum } from './common/constants/constants';
import { AppModule } from './app.module';
import { ExceptionResponseFilter } from './common/filters';
import validationOptions from './common/utils/validation-options';
import { useContainer } from 'class-validator';
import morgan from 'morgan';
import helmet from 'helmet';
<<<<<<< HEAD
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
=======
>>>>>>> 1699416 (PR #7 review resolve & updated api endpoints)

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

  // Added helment for the response headers.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          scriptSrc: ["'self'"],
          frameSrc: ["'self'"],
          connectSrc: ["'self'"],
        },
      },

      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
    }),
  );

  // adding request logger to the application
  app.use(
    morgan(
      ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
    ),
  );

  //@ts-ignore
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // enabling CORS for frontend consumption
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  });
  // enanbling API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // to ensure smooth function while application shutdown
  app.enableShutdownHooks();

  // Global Validations
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // Global Filters
  app.useGlobalFilters(new ExceptionResponseFilter());

  const env = process.env.ENV || EnvironmentEnum.Developemnt;

  if (env !== EnvironmentEnum.Production) {
    setupSwagger(app);
  }

  const port = process.env.PORT || 3001;

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/`);
}

bootstrap();
