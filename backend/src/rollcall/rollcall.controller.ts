import { Controller, Body, Patch, Param, Get } from '@nestjs/common';
import { RollcallService } from './rollcall.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/Role';
import { UserFromJwt } from '../auth/models/UserFromJwt';

type updateStatusType = {
  status: boolean;
};

@Controller('rollcall')
export class RollcallController {
  constructor(private readonly rollcallService: RollcallService) {}

  @Get()
  @Roles(Role.DRIVER)
  findAll(@CurrentUser() user: UserFromJwt) {
    return this.rollcallService.findAll(user);
  }

  @Patch(':id')
  @Roles(Role.DRIVER)
  updateStatus(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() data: updateStatusType,
  ) {
    return this.rollcallService.updateStatus(user, id, data);
  }
}
