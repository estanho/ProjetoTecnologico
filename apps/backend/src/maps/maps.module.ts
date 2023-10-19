import { Module } from '@nestjs/common';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { PlacesService } from './places/places.service';
import { PlacesController } from './places/places.controller';

@Module({
  providers: [
    {
      provide: GoogleMapsClient,
      useValue: new GoogleMapsClient({}),
    },
    PlacesService,
  ],
  controllers: [PlacesController],
})
export class MapsModule {}
