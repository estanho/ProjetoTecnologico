import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';

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

export class UpdateStudentDto {
  @IsString()
  name: string;
  @IsString()
  school_id: string;
  @IsBoolean()
  morning: boolean;
  @IsBoolean()
  afternoon: boolean;
  @IsBoolean()
  night: boolean;
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAdress)
  location: CreateAdress;
  @IsArray()
  @IsString({ each: true })
  responsibles: string[];
}
