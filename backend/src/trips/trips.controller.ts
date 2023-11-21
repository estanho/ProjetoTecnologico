import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/Role';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('driver')
  @Roles(Role.DRIVER)
  findAllDriver(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findAllDriver(user);
  }

  @Get('responsible')
  @Roles(Role.RESPONSIBLE)
  findAllResponsible(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findAllResponsible(user);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  findAllStudent(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findAllStudent(user);
  }

  @Patch(':id')
  @Roles(Role.RESPONSIBLE)
  updateStatus(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() data: { trip_id: string; student_id: string },
  ) {
    return this.tripsService.updateTripStudent(user, id, data);
  }

  @Get('current')
  findTrips(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findTrips(user);
  }
}
