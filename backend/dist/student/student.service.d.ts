import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
import { TripsLogicService } from '../trips/tripsLogic.service';
export declare class StudentService {
    private prismaService;
    private tripsLogicService;
    constructor(prismaService: PrismaService, tripsLogicService: TripsLogicService);
    create(user: UserFromJwt, createStudentDto: CreateStudentDto): Promise<{
        error: boolean;
        message: any;
    } | {
        error: boolean;
        message?: undefined;
    }>;
    findAll(user: UserFromJwt): Promise<{
        error: boolean;
        students: any[];
        started: boolean;
        message?: undefined;
    } | {
        error: boolean;
        message: any;
        students?: undefined;
        started?: undefined;
    }>;
    update(user: UserFromJwt, id: string, updateStudentDto: UpdateStudentDto): Promise<{
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
