import { Injectable } from '@nestjs/common';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';

type updateStatusType = {
  status: boolean;
};

@Injectable()
export class RollcallService {
  constructor(private prismaService: PrismaService) {}

  async findAll(user: UserFromJwt) {
    try {
      // Verificando Driver
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });
      if (driver === null) {
        throw new Error('no_driver');
      }
      // Pega os itinerario
      const itinerary = await this.prismaService.itinerary.findFirst({
        where: {
          driver: {
            user_id: user.id,
          },
        },
        select: {
          id: true,
        },
        orderBy: {
          day: 'desc',
        },
      });
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }
      // Pegando a viagem atual.
      const trip = await this.prismaService.trip.findFirst({
        where: {
          itinerary_id: itinerary.id,
          started_at: null,
        },
        select: {
          id: true,
        },
        orderBy: {
          estimated: 'asc',
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }
      // Pegando os student_trip
      const students_trips = await this.prismaService.student_Trip.findMany({
        where: {
          absent: false,
          trip_id: trip.id,
        },
        select: {
          id: true,
          rollCallPresent: true,
          student: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          student: {
            name: 'asc',
          },
        },
      });

      const result = [];

      students_trips.forEach((item) => {
        const newItem = {
          id: item.id,
          name: item.student.name,
          status: item.rollCallPresent,
        };
        result.push(newItem);
      });

      return { error: false, result };
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async updateStatus(user: UserFromJwt, id: string, data: updateStatusType) {
    try {
      // Verificando Driver
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });
      if (driver === null) {
        throw new Error('no_driver');
      }
      // Pega os itinerario
      const itinerary = await this.prismaService.itinerary.findFirst({
        where: {
          driver: {
            user_id: user.id,
          },
        },
        select: {
          id: true,
        },
        orderBy: {
          day: 'desc',
        },
      });
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }
      // Pegando a viagem atual.
      const trip = await this.prismaService.trip.findFirst({
        where: {
          itinerary_id: itinerary.id,
          started_at: null,
        },
        select: {
          id: true,
        },
        orderBy: {
          estimated: 'asc',
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }
      // Atualizando Student Trip
      await this.prismaService.student_Trip.update({
        where: {
          id: id,
          trip: {
            itinerary: {
              driver: {
                user_id: user.id,
              },
            },
          },
        },
        data: {
          rollCallPresent: data.status === true ? false : true,
        },
        select: {
          id: true,
          rollCallPresent: true,
        },
      });

      const students = await this.prismaService.student_Trip.findMany({
        where: {
          trip: {
            id: trip.id,
          },
        },
        select: {
          id: true,
          trip: {
            select: {
              id: true,
            },
          },
          rollCallPresent: true,
        },
      });

      const result = [];
      let allPresents = false;

      students.forEach((item) => {
        if (item.rollCallPresent === true) {
          result.push(item);
        }
      });

      if (result.length === students.length) {
        allPresents = true;
        await this.prismaService.trip.update({
          where: {
            id: trip.id,
          },
          data: {
            rollCall: false,
          },
        });
      } else {
        allPresents = false;
        await this.prismaService.trip.update({
          where: {
            id: trip.id,
          },
          data: {
            rollCall: true,
          },
        });
      }

      return { error: false, allPresents };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
