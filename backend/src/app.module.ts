import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { PrismaModule } from './database/prisma.module';
import { MapsModule } from './maps/maps.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { ItinerariesModule } from './itineraries/itineraries.module';
import { TripsModule } from './trips/trips.module';
import { NotificationModule } from './notification/notification.module';
import { TravelModule } from './travel/travel.module';
import { RollcallModule } from './rollcall/rollcall.module';
import { CronjobsModule } from './cronjobs/cronjobs.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MapsModule,
    SchoolModule,
    StudentModule,
    ItinerariesModule,
    TripsModule,
    NotificationModule,
    TravelModule,
    RollcallModule,
    CronjobsModule,
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
