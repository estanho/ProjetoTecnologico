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

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(
    @CurrentUser() user: UserFromJwt,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    return this.studentService.create(user, createStudentDto);
  }

  @Get()
  findAll(@CurrentUser() user: UserFromJwt) {
    return this.studentService.findAll(user);
  }

  @Put(':id')
  update(
    @CurrentUser() user: UserFromJwt,
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentService.update(user, id, updateStudentDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: UserFromJwt, @Param('id') id: string) {
    return this.studentService.remove(user, id);
  }
}
