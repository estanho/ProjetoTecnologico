declare class CreateAdress {
    id: string;
    name: string;
    place_id: string;
    latitude: number;
    longitude: number;
}
export declare class UpdateSchoolDto {
    name: string;
    morning: boolean;
    morning_arrival: string;
    morning_departure: string;
    afternoon: boolean;
    afternoon_arrival: string;
    afternoon_departure: string;
    night: boolean;
    night_arrival: string;
    night_departure: string;
    location: CreateAdress;
    default_location: CreateAdress;
}
export {};
