import { Injectable } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly register: client.Registry;
  private readonly httpRequestsTotal: client.Counter<string>;
  private readonly httpRequestDuration: client.Histogram<string>;

  constructor() {
    this.register = new client.Registry();
    this.register.setDefaultLabels({ app: 'kinl-api' });
    client.collectDefaultMetrics({ register: this.register });

    this.httpRequestsTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
      registers: [this.register],
    });
  }

  incrementHttpRequestsTotal(method: string, route: string, statusCode: string) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
  }

  observeRequestDuration(
    method: string,
    route: string,
    statusCode: number,
    durationSec: number,
  ) {
    this.httpRequestDuration.observe(
      { method, route, status_code: statusCode },
      durationSec,
    );
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
