import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const logFile = process.env.LOGGER_APP + '.log';
    // const logPath = process.cwd() + '<path>' + logFile;

    // const { url, method, headers, body } = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((data) => {
        const responseBody = JSON.stringify(data);
        console.log(
          '🚀 ~ file: logger.interceptor.ts:28 ~ LoggerInterceptor ~ tap ~ responseBody:',
          responseBody,
        );
      }),
    );
  }
}
