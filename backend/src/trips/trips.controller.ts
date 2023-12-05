import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/Role';

type updateStatusType = {
  student_id: string;
  driver_id: string;
  type: string;
};

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get('driver')
  @Roles(Role.DRIVER)
  findTripsDriver(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findTripsDriver(user);
  }

  @Get('driver/historic')
  @Roles(Role.DRIVER)
  findAllDriver(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findAllDriver(user);
  }

  @Get('responsible')
  @Roles(Role.RESPONSIBLE)
  findTripsResponsible(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findTripsResponsible(user);
  }

  @Get('responsible/historic')
  @Roles(Role.RESPONSIBLE)
  findAllResponsible(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findAllResponsible(user);
  }

  @Get('student')
  @Roles(Role.STUDENT)
  findTripsStudent(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findTripsStudent(user);
  }

  @Get('student/historic')
  @Roles(Role.STUDENT)
  findAllStudent(@CurrentUser() user: UserFromJwt) {
    return this.tripsService.findAllStudent(user);
  }

  @Patch(':id')
  @Roles(Role.RESPONSIBLE)
  updateStatus(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() data: updateStatusType,
  ) {
    return this.tripsService.updateTripStudent(user, id, data);
  }
}
