import { PrismaService } from '../database/prisma.service';
import { TripsLogicService } from '../trips/tripsLogic.service';
export declare class CronService {
    private prismaService;
    private tripsLogicService;
    constructor(prismaService: PrismaService, tripsLogicService: TripsLogicService);
    handler(): Promise<{
        error: boolean;
        message: any;
        itineraries?: undefined;
    } | {
        error: boolean;
        itineraries: boolean;
        message?: undefined;
    }>;
}
