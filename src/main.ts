import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('LIPA FARE API')
    .setDescription('LIPA FARE API Documentation')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Email Subscription')
    .addTag('Cars')
    .addTag('Saccos')
    .addTag('Drivers')
    .addTag('Payments')
    .addTag('Passengers')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}

bootstrap();
