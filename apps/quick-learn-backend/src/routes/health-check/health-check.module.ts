import { Module } from '@nestjs/common';
import { HealthCheckController } from './health-check.controller';

@Module({
  providers: [],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
