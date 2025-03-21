import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CorsInterceptor } from './cors.interceptor';
import * as process from 'process';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.CORS_DOMEN, process.env.CORS_DOMEN_LOCAL],
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new CorsInterceptor());
  await app.listen(3002);
}
bootstrap();
