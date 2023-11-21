import { Module } from '@nestjs/common';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { TripsModule } from '../trips/trips.module';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService],
  imports: [ItinerariesModule, TripsModule],
})
export class SchoolModule {}
