import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { CronjobsController } from './cronjobs.controller';
import { TripsModule } from '../trips/trips.module';

@Module({
  controllers: [CronjobsController],
  providers: [CronjobsService],
  imports: [TripsModule],
})
export class CronjobsModule {}
