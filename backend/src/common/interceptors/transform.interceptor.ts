import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((payload) => {
        const isPaginated = payload && payload.data !== undefined && payload.meta !== undefined;
        
        return {
          success: true,
          message: payload?.message || 'Thao tác thành công',
          data: isPaginated ? payload.data : (payload?.data ?? payload),
          meta: isPaginated ? payload.meta : undefined,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
