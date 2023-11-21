import { PrismaService } from '../database/prisma.service';
import { TripGenerateService } from './services/tripsGenerate.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { TripCreateService } from './services/tripsCreate.service';
export declare class TripsLogicService {
    private prismaService;
    private readonly tripGenerateService;
    private readonly tripCreateService;
    constructor(prismaService: PrismaService, tripGenerateService: TripGenerateService, tripCreateService: TripCreateService);
    create(user: UserFromJwt): Promise<{
        error: boolean;
        morningGoingTrip: any;
        morningReturnTrip: any;
        morningAfternoonTrip: any;
        afternoonGoingTrip: any;
        afternoonReturnTrip: any;
        afternoonNightTrip: any;
        nightGoingTrip: any;
        nightReturnTrip: any;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        morningGoingTrip?: undefined;
        morningReturnTrip?: undefined;
        morningAfternoonTrip?: undefined;
        afternoonGoingTrip?: undefined;
        afternoonReturnTrip?: undefined;
        afternoonNightTrip?: undefined;
        nightGoingTrip?: undefined;
        nightReturnTrip?: undefined;
    }>;
}
