import { CreateSchoolDto } from './dto/create-school.dto';
import { PrismaService } from '../database/prisma.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { TripsLogicService } from '../trips/tripsLogic.service';
export declare class SchoolService {
    private prismaService;
    private itinerariesService;
    private tripsLogicService;
    constructor(prismaService: PrismaService, itinerariesService: ItinerariesService, tripsLogicService: TripsLogicService);
    create(user: UserFromJwt, createSchoolDto: CreateSchoolDto): Promise<{
        error: boolean;
        message: any;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    findAll(user: UserFromJwt): Promise<{
        error: boolean;
        schools: any[];
        started: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        schools?: undefined;
        started?: undefined;
    }>;
    update(user: UserFromJwt, id: string, updateSchoolDto: UpdateSchoolDto): Promise<{
        error: boolean;
        message: any;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    updateStatus(user: UserFromJwt, id: string, data: {
        status: boolean;
    }): Promise<{
        error: boolean;
        message: any;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    remove(user: UserFromJwt, id: string): Promise<{
        error: boolean;
        message: any;
    } | {
        error: boolean;
        message?: undefined;
    }>;
}
