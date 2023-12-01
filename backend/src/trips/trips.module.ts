import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { TripTimeService } from './services/tripsTime.service';
import { MapsModule } from '../maps/maps.module';
import { TripGenerateService } from './services/tripsGenerate.service';
import { TripCreateService } from './services/tripsCreate.service';
import { TripsLogicService } from './tripsLogic.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [MapsModule, NotificationModule],
  controllers: [TripsController],
  providers: [
    TripsService,
    TripsLogicService,
    TripCreateService,
    TripGenerateService,
    TripTimeService,
  ],
  exports: [TripsLogicService],
})
export class TripsModule {}
