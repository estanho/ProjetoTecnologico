import { PrismaService } from '../../database/prisma.service';
export declare class TripCreateService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createTrip(trip: any, shift: any, type: any, itinerary_id: any): Promise<{
        error: boolean;
        trip: {
            id: string;
            shift: import(".prisma/client").$Enums.Shift;
            type: import(".prisma/client").$Enums.TypeTrip;
            path: import(".prisma/client").Prisma.JsonValue;
            duration: number;
            km: number;
            estimated: Date;
            started_at: Date;
            finished_at: Date;
            created_at: Date;
            itinerary_id: string;
        };
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        trip?: undefined;
    }>;
    createStudentTrip(trip: any, trip_id: string): Promise<{
        error: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
    }>;
}
