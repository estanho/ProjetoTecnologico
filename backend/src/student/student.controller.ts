import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/models/Role';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @Roles(Role.DRIVER)
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    return this.studentService.create(user, createStudentDto);
  }

  @Get()
  @Roles(Role.DRIVER)
  findAll(@CurrentUser() user: UserFromJwt) {
    return this.studentService.findAll(user);
  }

  @Put(':id')
  @Roles(Role.DRIVER)
  update(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(user, id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.DRIVER)
  remove(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.studentService.remove(user, id);
  }
}
