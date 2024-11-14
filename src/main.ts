import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://whox.is', 'http://localhost:3000'],
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  await app.listen(3002);
}
bootstrap();
