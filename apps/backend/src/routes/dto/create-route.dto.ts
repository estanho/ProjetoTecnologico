import { IsString } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  name: string;
  @IsString()
  source_id: string;
  @IsString()
  destination_id: string;
}
