declare class CreateAdress {
    id: string;
    name: string;
    place_id: string;
    latitude: number;
    longitude: number;
}
export declare class UpdateStudentDto {
    name: string;
    school_id: string;
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    location: CreateAdress;
    responsibles: string[];
}
export {};
