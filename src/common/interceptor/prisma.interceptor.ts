import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2025') {
            throw new NotFoundException(error?.meta?.cause || error.message);
          } else if (error.code === 'P2002') {
            const target = (error?.meta?.target as string[]) || [];
            throw new ConflictException('Unique constraint failure: ' + target.toString());
          }
          throw new InternalServerErrorException('Database error');
        }
        // If it's not a Prisma error, let it propagate
        return throwError(() => error);
      }),
    );
  }
}
