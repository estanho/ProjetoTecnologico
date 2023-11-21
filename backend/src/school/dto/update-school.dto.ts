import {
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateAdress {
  @IsString()
  id: string;
  @IsString()
  name: string;
  @IsString()
  place_id: string;
  @IsNumber()
  latitude: number;
  @IsNumber()
  longitude: number;
}

export class UpdateSchoolDto {
  @IsString()
  name: string;
  @IsBoolean()
  morning: boolean;
  @IsString()
  @IsOptional()
  morning_arrival: string;
  @IsString()
  @IsOptional()
  morning_departure: string;
  @IsBoolean()
  afternoon: boolean;
  @IsString()
  @IsOptional()
  afternoon_arrival: string;
  @IsString()
  @IsOptional()
  afternoon_departure: string;
  @IsBoolean()
  night: boolean;
  @IsString()
  @IsOptional()
  night_arrival: string;
  @IsOptional()
  @IsString()
  night_departure: string;
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAdress)
  location: CreateAdress;
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAdress)
  default_location: CreateAdress;
}
