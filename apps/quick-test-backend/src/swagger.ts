import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Quick Test API Documentation')
    .setDescription('Welcome to the API documentation for Quick Test. This API provides a robust set of endpoints to interact with our application, allowing you to manage resources, perform various operations, and integrate seamlessly with your systems.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
