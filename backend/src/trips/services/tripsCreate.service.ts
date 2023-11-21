import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Shift, TypeTrip } from '@prisma/client';

function converterStringParaShift(valor: string): Shift {
  return Shift[valor as keyof typeof Shift];
}

function converterStringParaType(valor: string): TypeTrip {
  return TypeTrip[valor as keyof typeof TypeTrip];
}

@Injectable()
export class TripCreateService {
  constructor(private prismaService: PrismaService) {}

  async createTrip(trip: any, shift: any, type: any, itinerary_id: any) {
    try {
      const newTrip = await this.prismaService.trip.create({
        data: {
          path: JSON.stringify(trip.directions),
          shift: converterStringParaShift(shift),
          type: converterStringParaType(type),
          km: trip.times.totalKM,
          duration: trip.times.totalTravelTime,
          itinerary: {
            connect: {
              id: itinerary_id,
            },
          },
          estimated: trip.times.estimated,
        },
      });

      const students_trip = await this.createStudentTrip(trip, newTrip.id);

      if (students_trip.error === true) {
        throw new Error('Erro ao gerar Trips para estudantes.');
      }

      return { error: false, trip: newTrip };
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async createStudentTrip(trip: any, trip_id: string) {
    try {
      for (let i = 0; i < trip.ordainedStudents.length; i++) {
        await this.prismaService.student_Trip.create({
          data: {
            order: i + 1,
            absent: false,
            type:
              trip.ordainedStudents[i].type === 'going' ? 'going' : 'return',
            trip: {
              connect: {
                id: trip_id,
              },
            },
            student: {
              connect: {
                id: trip.ordainedStudents[i].id,
              },
            },
          },
        });
      }

      for (let i = 0; i < trip.studentsAbsent.length; i++) {
        await this.prismaService.student_Trip.create({
          data: {
            order: null,
            absent: true,
            type: trip.studentsAbsent[i].type === 'going' ? 'going' : 'return',
            trip: {
              connect: {
                id: trip_id,
              },
            },
            student: {
              connect: {
                id: trip.studentsAbsent[i].id,
              },
            },
          },
        });
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error };
    }
  }
}
