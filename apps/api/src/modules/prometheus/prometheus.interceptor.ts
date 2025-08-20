import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { PrometheusService } from './prometheus.service';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const start = process.hrtime();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;

        this.prometheusService.incrementHttpRequestsTotal(
          request.method,
          request.route?.path || request.url,
          statusCode,
        );

        const diff = process.hrtime(start);
        const durationSec = diff[0] + diff[1] / 1e9;

        this.prometheusService.observeRequestDuration(
          request.method,
          request.route?.path || request.url,
          statusCode,
          durationSec,
        );
      }),
    );
  }
}
