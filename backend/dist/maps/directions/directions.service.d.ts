import { Client as GoogleMapsClient, TravelMode } from '@googlemaps/google-maps-services-js';
export declare class DirectionsService {
    private googleMapsClient;
    constructor(googleMapsClient: GoogleMapsClient);
    getIntervalDirections(originId: string, destinationId: string): Promise<{
        geocoded_waypoints: import("@googlemaps/google-maps-services-js").GeocodedWaypoint[];
        routes: import("@googlemaps/google-maps-services-js").DirectionsRoute[];
        available_travel_modes: string[];
        status: import("@googlemaps/google-maps-services-js").Status;
        error_message: string;
        html_attributions?: string[];
        next_page_token?: string;
    }>;
    getDirections(originId: string, destinationId: string, waypoints: any): Promise<{
        request: {
            origin: {
                place_id: import("@googlemaps/google-maps-services-js").LatLng;
                lat: number;
                lng: number;
            };
            destination: {
                place_id: import("@googlemaps/google-maps-services-js").LatLng;
                lat: number;
                lng: number;
            };
            mode: TravelMode;
        };
        geocoded_waypoints: import("@googlemaps/google-maps-services-js").GeocodedWaypoint[];
        routes: import("@googlemaps/google-maps-services-js").DirectionsRoute[];
        available_travel_modes: string[];
        status: import("@googlemaps/google-maps-services-js").Status;
        error_message: string;
        html_attributions?: string[];
        next_page_token?: string;
    }>;
}
