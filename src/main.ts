import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: [`${process.env.CORS_DOMEN}`, 'http://localhost:3000'],
    origin: true,
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(3002);
}
bootstrap();
