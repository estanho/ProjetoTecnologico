import { Module } from '@nestjs/common';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { ItinerariesModule } from '../itineraries/itineraries.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [TravelController],
  providers: [TravelService],
  imports: [ItinerariesModule, NotificationModule],
})
export class TravelModule {}
