import { Body, Controller, Get, Query } from '@nestjs/common';
import { DirectionsService } from './directions.service';

@Controller('directions')
export class DirectionsController {
  constructor(private directionsService: DirectionsService) {}

  @Get()
  getDirections(
    @Query('originId') originId: string,
    @Query('destinationId') destinationId: string,
    @Body() waypoints: any,
  ) {
    return this.directionsService.getDirections(
      originId,
      destinationId,
      waypoints,
    );
  }
}
