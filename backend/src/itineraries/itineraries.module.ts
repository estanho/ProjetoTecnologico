import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';
import { TripsModule } from '../trips/trips.module';

@Module({
  controllers: [],
  providers: [ItinerariesService],
  exports: [ItinerariesService],
  imports: [TripsModule],
})
export class ItinerariesModule {}
