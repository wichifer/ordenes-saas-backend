import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(

      new ValidationPipe({

        whitelist: true,

        forbidNonWhitelisted: true,

        transform: true,

      }),

);
  const config = new DocumentBuilder()
    .setTitle('Ordenes SaaS API')
    .setDescription('API del sistema de gestión de órdenes de compra')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

}

bootstrap();