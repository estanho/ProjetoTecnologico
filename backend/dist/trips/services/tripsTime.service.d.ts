export declare class TripTimeService {
    checkIntervalTime(routes: any, return_trip: any): Promise<{
        totalTravelTime: number;
        return_time_add: Date;
        totalKM: number;
    }>;
    checkTime(shift: string, type: string, routes: any, school: any, students_length: number): Promise<{
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
    }>;
    checkTimeMix(type: string, routes: any, school_return: any, students_length: number): Promise<{
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
    }>;
}
