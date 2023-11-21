import { TripsService } from './trips.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    findAllDriver(user: UserFromJwt): Promise<{
        error: boolean;
        result: any[];
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        result?: undefined;
    }>;
    findAllResponsible(user: UserFromJwt): Promise<{
        error: boolean;
        result: any[];
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        result?: undefined;
    }>;
    findAllStudent(user: UserFromJwt): Promise<{
        error: boolean;
        result: any[];
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        result?: undefined;
    }>;
    updateStatus(user: UserFromJwt, id: string, data: {
        trip_id: string;
        student_id: string;
    }): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
    findTrips(user: UserFromJwt): Promise<{
        error: boolean;
        result: {};
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        result?: undefined;
    }>;
}
