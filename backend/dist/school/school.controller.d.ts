import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { UserFromJwt } from '../auth/models/UserFromJwt';
export declare class SchoolController {
    private readonly schoolService;
    constructor(schoolService: SchoolService);
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
