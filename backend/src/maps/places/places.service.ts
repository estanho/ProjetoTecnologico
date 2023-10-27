import { Injectable } from '@nestjs/common';
import {
  Client as GoogleMapsClient,
  PlaceInputType,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class PlacesService {
  constructor(private googleMapsClient: GoogleMapsClient) {}

  async findPlace(text: string) {
    const { data } = await this.googleMapsClient.findPlaceFromText({
      params: {
        input: text,
        inputtype: PlaceInputType.textQuery,
        fields: ['formatted_address', 'geometry', 'name', 'place_id'],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });
    return data;
  }
}
