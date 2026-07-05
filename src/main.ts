import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
//   app.enableCors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// });



// app.enableCors({
//   origin: [
//     'http://localhost:5173',
//     'http://192.168.1.37:5173',
//   ],
//   credentials: true,
// });

app.enableCors({
  origin: true,
  credentials: true,
});
    app.useGlobalPipes(

      new ValidationPipe({

        whitelist: true,

        forbidNonWhitelisted: true,

        transform: true,

      }),

);
const config = new DocumentBuilder()

  .setTitle('Ordenes SaaS API')

  .setDescription('API del sistema SaaS')

  .setVersion('1.0')

  .addBearerAuth()

  .build();

const document =
  SwaggerModule.createDocument(
    app,
    config,
  );

SwaggerModule.setup(
  'docs',
  app,
  document,
);

  await app.listen(3000, '0.0.0.0');

}

bootstrap();