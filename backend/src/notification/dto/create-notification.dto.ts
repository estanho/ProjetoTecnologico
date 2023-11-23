import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class KeysDto {
  @IsString()
  @IsNotEmpty()
  p256dh: string;

  @IsString()
  @IsNotEmpty()
  auth: string;
}

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string;

  @IsOptional()
  @IsDateString()
  expirationTime?: string | null;

  @Type(() => KeysDto)
  @ValidateNested()
  keys: KeysDto;
}
