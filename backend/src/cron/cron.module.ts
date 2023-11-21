import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TripsModule } from '../trips/trips.module';

@Module({
  controllers: [],
  providers: [CronService],
  exports: [],
  imports: [TripsModule],
})
export class CronModule {}
