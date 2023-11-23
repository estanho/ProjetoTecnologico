import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PrismaModule } from './database/prisma.module';
import { MapsModule } from './maps/maps.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { TripsModule } from './trips/trips.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './cron/cron.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MapsModule,
    SchoolModule,
    StudentModule,
    ItinerariesModule,
    TripsModule,
    CronModule,
    ScheduleModule.forRoot(),
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
