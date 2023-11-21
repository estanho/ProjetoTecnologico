import { Injectable } from '@nestjs/common';
import {
  DirectionsRequest,
  Client as GoogleMapsClient,
  TravelMode,
} from '@googlemaps/google-maps-services-js';

@Injectable()
export class DirectionsService {
  constructor(private googleMapsClient: GoogleMapsClient) {}

  async getIntervalDirections(originId: string, destinationId: string) {
    const params: DirectionsRequest['params'] = {
      origin: `place_id:${originId}`,
      destination: `place_id:${destinationId}`,
      mode: TravelMode.driving,
      key: process.env.GOOGLE_MAPS_API_KEY,
    };

    try {
      const { data } = await this.googleMapsClient.directions({
        params,
      });

      return {
        ...data,
      };
    } catch (error) {
      console.error(
        'Erro ao obter direções:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  }

  async getDirections(originId: string, destinationId: string, waypoints: any) {
    const params: DirectionsRequest['params'] = {
      origin: `place_id:${originId}`,
      destination: `place_id:${destinationId}`,
      waypoints: waypoints,
      optimize: true,
      mode: TravelMode.driving,
      key: process.env.GOOGLE_MAPS_API_KEY,
    };

    try {
      const { data } = await this.googleMapsClient.directions({
        params,
      });

      return {
        ...data,
        request: {
          origin: {
            place_id: params.origin,
            lat: data.routes[0].legs[0].start_location.lat,
            lng: data.routes[0].legs[0].start_location.lng,
          },
          destination: {
            place_id: params.destination,
            lat: data.routes[0].legs[data.routes[0].legs.length - 1]
              .end_location.lat,
            lng: data.routes[0].legs[data.routes[0].legs.length - 1]
              .end_location.lng,
          },
          mode: params.mode,
        },
      };
    } catch (error) {
      console.error(
        'Erro ao obter direções:',
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  }
}
