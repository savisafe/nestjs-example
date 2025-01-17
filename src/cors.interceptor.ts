import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    // Получаем список разрешённых доменов из переменных окружения
    const allowedOrigins = [
      process.env.CORS_DOMEN, // Основной домен
      process.env.CORS_DOMEN_LOCAL, // Локальный домен
    ].filter(Boolean); // Убираем undefined, если переменные не заданы

    const origin = request.headers.origin;

    if (allowedOrigins.includes(origin)) {
      // Устанавливаем заголовки CORS, если источник разрешён
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE',
      );
      response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization',
      );
      response.setHeader('Access-Control-Allow-Credentials', 'true'); // Если нужно передавать куки или авторизацию
    }

    return next.handle();
  }
}
