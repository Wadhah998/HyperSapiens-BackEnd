import { Module, OnModuleInit } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';


@Module({
  providers: [PrometheusService],
  exports: [PrometheusService],
})
export class PrometheusModule implements OnModuleInit {
  constructor(private readonly prometheusService: PrometheusService) {}

  onModuleInit() {
    this.prometheusService.initializeMetrics();
  }
}

