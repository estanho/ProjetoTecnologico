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

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() createSchoolDto: CreateSchoolDto,
  ) {
    return this.schoolService.create(user, createSchoolDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserFromJwt) {
    return this.schoolService.findAll(user);
  }

  @Put(':id')
  update(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() updateSchoolDto: UpdateSchoolDto,
  ) {
    return this.schoolService.update(user, id, updateSchoolDto);
  }

  @Patch(':id')
  updateStatus(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() data: { status: boolean },
  ) {
    return this.schoolService.updateStatus(user, id, data);
  }

  @Delete(':id')
  remove(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.schoolService.remove(user, id);
  }
}
