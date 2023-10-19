import { Controller, Get, Query } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { IsPublic } from '../../auth/decorators/is-public.decorator';

@Controller('directions')
export class DirectionsController {
  constructor(private directionsService: DirectionsService) {}

  @IsPublic()
  @Get()
  getDirections(
    @Query('originId') originId: string,
    @Query('destinationId') destinationId: string,
  ) {
    return this.directionsService.getDirections(originId, destinationId);
  }
}
