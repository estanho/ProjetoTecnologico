import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @IsPublic()
  @Get()
  findPlace(@Query('text') text: string) {
    return this.placesService.findPlace(text);
  }
}
