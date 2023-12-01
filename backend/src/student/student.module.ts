import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TripsModule } from '../trips/trips.module';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [TripsModule],
})
export class StudentModule {}
