import { Module } from '@nestjs/common';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { DirectionsService } from './directions/directions.service';
import { DirectionsController } from './directions/directions.controller';

@Module({
  providers: [
    {
      provide: GoogleMapsClient,
      useValue: new GoogleMapsClient({}),
    },
    DirectionsService,
  ],
  controllers: [DirectionsController],
  exports: [DirectionsService],
})
export class MapsModule {}
