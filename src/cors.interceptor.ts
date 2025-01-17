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

    // Устанавливаем заголовки CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );
    response.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    response.setHeader('Access-Control-Allow-Credentials', 'true'); // Если нужно передавать куки или авторизацию

    return next.handle();
  }
}
