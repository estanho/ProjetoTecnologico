import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserFromJwt } from '../auth/models/UserFromJwt';
export declare class StudentController {
    private readonly studentService;
    constructor(studentService: StudentService);
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
