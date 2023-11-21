import { UserFromJwt } from '../auth/models/UserFromJwt';
import { TripGenerateService } from './services/tripsGenerate.service';
import { PrismaService } from '../database/prisma.service';
import { TripCreateService } from './services/tripsCreate.service';
export declare class TripsService {
    private prismaService;
    private readonly tripGenerateService;
    private readonly tripCreateService;
    constructor(prismaService: PrismaService, tripGenerateService: TripGenerateService, tripCreateService: TripCreateService);
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
    updateTripStudent(user: UserFromJwt, id: string, data: any): Promise<{
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
