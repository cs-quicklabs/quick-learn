import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { setupSwagger } from './swagger';
import { useContainer } from 'class-validator';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { EnvironmentEnum } from './common/constants/constants';
import { AppModule } from './app.module';
import { ExceptionResponseFilter } from './common/filters';
import validationOptions from './common/utils/validation-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // adding cookie parser
  app.use(cookieParser());

  // enabling CORS for frontend consumption
  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // global prefix
  app.setGlobalPrefix('api');

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
