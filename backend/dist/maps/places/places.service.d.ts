import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
export declare class PlacesService {
    private googleMapsClient;
    constructor(googleMapsClient: GoogleMapsClient);
    findPlace(text: string): Promise<import("@googlemaps/google-maps-services-js").FindPlaceFromTextResponseData>;
}
