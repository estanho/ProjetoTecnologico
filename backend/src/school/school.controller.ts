import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/Role';

type updateStatusType = {
  status: boolean;
};

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @Roles(Role.DRIVER)
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    return this.schoolService.create(user, createSchoolDto);
  }

  @Get()
  @Roles(Role.DRIVER)
  findAll(@CurrentUser() user: UserFromJwt) {
    return this.schoolService.findAll(user);
  }

  @Put(':id')
  @Roles(Role.DRIVER)
  update(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(user, id, updateSchoolDto);
  }

  @Patch(':id')
  @Roles(Role.DRIVER)
  updateStatus(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() data: updateStatusType,
  ) {
    return this.schoolService.updateStatus(user, id, data);
  }

  @Delete(':id')
  @Roles(Role.DRIVER)
  remove(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.schoolService.remove(user, id);
  }
}
