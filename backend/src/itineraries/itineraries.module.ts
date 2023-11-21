import { Module } from '@nestjs/common';
import { ItinerariesService } from './itineraries.service';

@Module({
  controllers: [],
  providers: [ItinerariesService],
  exports: [ItinerariesService],
  imports: [],
})
export class ItinerariesModule {}
