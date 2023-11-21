import { PrismaService } from '../../database/prisma.service';
import { DirectionsService } from '../../maps/directions/directions.service';
import { TripTimeService } from './tripsTime.service';
export declare class TripGenerateService {
    private prismaService;
    private directionsService;
    private tripsTimeService;
    constructor(prismaService: PrismaService, directionsService: DirectionsService, tripsTimeService: TripTimeService);
    intervalTrip(return_time: any, going_time: any): Promise<{
        error: boolean;
        times: {
            totalTravelTime: number;
            return_time_add: Date;
            totalKM: number;
        };
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        times?: undefined;
    }>;
    generateTrip(user_id: string, shift: string, type: string): Promise<{
        error: boolean;
        studentsAbsent: any[];
        ordainedStudents: any[];
        ordainedStudentsAll: any[];
        times: {
            totalTravelTime: number;
            estimated: Date;
            totalKM: number;
            error?: undefined;
            message?: undefined;
        } | {
            error: boolean;
            message: any;
            totalTravelTime?: undefined;
            estimated?: undefined;
            totalKM?: undefined;
        };
        timesAll: {
            totalTravelTime: number;
            estimated: Date;
            totalKM: number;
            error?: undefined;
            message?: undefined;
        } | {
            error: boolean;
            message: any;
            totalTravelTime?: undefined;
            estimated?: undefined;
            totalKM?: undefined;
        };
        directions: {
            available_travel_modes: string[];
            geocoded_waypoints: import("@googlemaps/google-maps-services-js").GeocodedWaypoint[];
            routes: import("@googlemaps/google-maps-services-js").DirectionsRoute[];
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
                mode: import("@googlemaps/google-maps-services-js").TravelMode;
            };
            status: import("@googlemaps/google-maps-services-js").Status.OK;
        };
        school: {
            id: string;
            address: {
                id: string;
                name: string;
                place_id: string;
                latitude: number;
                longitude: number;
            };
            name: string;
            morning_arrival: Date;
            morning_departure: Date;
            afternoon_arrival: Date;
            afternoon_departure: Date;
            night_arrival: Date;
            night_departure: Date;
            default_location: {
                id: string;
                name: string;
                place_id: string;
                latitude: number;
                longitude: number;
            };
        };
        students_length: number;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        studentsAbsent?: undefined;
        ordainedStudents?: undefined;
        ordainedStudentsAll?: undefined;
        times?: undefined;
        timesAll?: undefined;
        directions?: undefined;
        school?: undefined;
        students_length?: undefined;
    }>;
    generateMixTrip(return_trip: any, going_trip: any, type: string): Promise<{
        error: boolean;
        studentsAbsent: any;
        ordainedStudents: any[];
        ordainedStudentsAll: any[];
        times: {
            totalTravelTime: number;
            estimated: Date;
            totalKM: number;
            error?: undefined;
            message?: undefined;
        } | {
            error: boolean;
            message: any;
            totalTravelTime?: undefined;
            estimated?: undefined;
            totalKM?: undefined;
        };
        timesAll: {
            totalTravelTime: number;
            estimated: Date;
            totalKM: number;
            error?: undefined;
            message?: undefined;
        } | {
            error: boolean;
            message: any;
            totalTravelTime?: undefined;
            estimated?: undefined;
            totalKM?: undefined;
        };
        directions: {
            available_travel_modes: string[];
            geocoded_waypoints: import("@googlemaps/google-maps-services-js").GeocodedWaypoint[];
            routes: import("@googlemaps/google-maps-services-js").DirectionsRoute[];
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
                mode: import("@googlemaps/google-maps-services-js").TravelMode;
            };
            status: import("@googlemaps/google-maps-services-js").Status.OK;
        };
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        studentsAbsent?: undefined;
        ordainedStudents?: undefined;
        ordainedStudentsAll?: undefined;
        times?: undefined;
        timesAll?: undefined;
        directions?: undefined;
    }>;
}
