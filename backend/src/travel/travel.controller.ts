import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { TravelService } from './travel.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/Role';

type locationType = {
  lat: number;
  lng: number;
};

@Controller('travel')
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get('current')
  @Roles(Role.DRIVER)
  findTripCurrent(@CurrentUser() user: UserFromJwt) {
    return this.travelService.findTripCurrent(user);
  }

  @Get('path')
  @Roles(Role.DRIVER)
  findPath(@CurrentUser() user: UserFromJwt) {
    return this.travelService.findPath(user);
  }

  @Patch('start/:id')
  @Roles(Role.DRIVER)
  startTrip(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.travelService.startTrip(user, id);
  }

  @Patch('catch/:id')
  @Roles(Role.DRIVER)
  catchStudent(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.travelService.catchStudent(user, id);
  }

  @Patch('end/:id')
  @Roles(Role.DRIVER)
  endTrip(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.travelService.endTrip(user, id);
  }

  @Patch('location')
  @Roles(Role.DRIVER)
  updateLocation(@CurrentUser() user: UserFromJwt, @Body() body: locationType) {
    return this.travelService.updateLocation(user, body);
  }

  @Get('student/:id')
  findStudent(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.travelService.findStudent(user, id);
  }
}
