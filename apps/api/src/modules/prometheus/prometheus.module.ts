import { Module } from '@nestjs/common';
import { PrometheusController } from './prometheus.controller';
import { PrometheusService } from './prometheus.service';

@Module({
  providers: [PrometheusService],
  controllers: [PrometheusController],
})
export class PrometheusModule {}
