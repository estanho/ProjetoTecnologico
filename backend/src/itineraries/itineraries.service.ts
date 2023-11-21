import { Injectable } from '@nestjs/common';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ItinerariesService {
  constructor(private prismaService: PrismaService) {}

  async create(user: UserFromJwt) {
    try {
      // Verifica Driver
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (driver === null) {
        throw new Error('no_driver');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Verifica se é final de semana e ajusta para proxima segunda
      if (today.getDay() === 6 || today.getDay() === 0) {
        while (today.getDay() !== 1) {
          today.setDate(today.getDate() + 1);
        }
      }
      // Criando itinerary
      const itinerary = await this.prismaService.itinerary.create({
        data: {
          day: today,
          driver: {
            connect: {
              id: driver.id,
            },
          },
        },
      });

      return { error: false, itinerary };
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async update(user: UserFromJwt) {
    try {
      // Verifica Driver
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: user.id,
        },
      });

      if (driver === null) {
        throw new Error('no_driver');
      }
      // Encontrando itinerary
      const itinerary = await this.prismaService.itinerary.findFirst({
        where: {
          driver: {
            user_id: user.id,
          },
        },
        orderBy: {
          day: 'desc',
        },
        select: {
          id: true,
          day: true,
          started: true,
          school_morning_id: true,
          school_morning: {
            select: {
              name: true,
              status: true,
              morning_arrival: true,
              morning_departure: true,
              address: {
                select: {
                  name: true,
                },
              },
              default_location: {
                select: {
                  name: true,
                },
              },
            },
          },
          school_afternoon_id: true,
          school_afternoon: {
            select: {
              name: true,
              status: true,
              afternoon_arrival: true,
              afternoon_departure: true,
              address: {
                select: {
                  name: true,
                },
              },
              default_location: {
                select: {
                  name: true,
                },
              },
            },
          },
          school_night_id: true,
          school_night: {
            select: {
              name: true,
              status: true,
              night_arrival: true,
              night_departure: true,
              address: {
                select: {
                  name: true,
                },
              },
              default_location: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      // Verificando dados da escola da manhã
      const school_morning = await this.prismaService.school.findFirst({
        where: {
          driver: {
            user_id: user.id,
          },
          morning: true,
          status: true,
        },
        select: {
          id: true,
        },
      });
      // Verificando dados da escola da tarde
      const school_afternoon = await this.prismaService.school.findFirst({
        where: {
          driver: {
            user_id: user.id,
          },
          afternoon: true,
          status: true,
        },
        select: {
          id: true,
        },
      });
      // Verificando dados da escola da noite
      const school_night = await this.prismaService.school.findFirst({
        where: {
          driver: {
            user_id: user.id,
          },
          night: true,
          status: true,
        },
        select: {
          id: true,
        },
      });

      if (school_morning !== null) {
        await this.prismaService.itinerary.update({
          where: {
            id: itinerary.id,
          },
          data: {
            school_morning: {
              connect: {
                id: school_morning.id,
              },
            },
          },
        });
      } else {
        await this.prismaService.itinerary.update({
          where: {
            id: itinerary.id,
          },
          data: {
            school_morning_id: null,
          },
        });
      }

      if (school_afternoon !== null) {
        await this.prismaService.itinerary.update({
          where: {
            id: itinerary.id,
          },
          data: {
            school_afternoon: {
              connect: {
                id: school_afternoon.id,
              },
            },
          },
        });
      } else {
        await this.prismaService.itinerary.update({
          where: {
            id: itinerary.id,
          },
          data: {
            school_afternoon_id: null,
          },
        });
      }

      if (school_night !== null) {
        await this.prismaService.itinerary.update({
          where: {
            id: itinerary.id,
          },
          data: {
            school_night: {
              connect: {
                id: school_night.id,
              },
            },
          },
        });
      } else {
        await this.prismaService.itinerary.update({
          where: {
            id: itinerary.id,
          },
          data: {
            school_night_id: null,
          },
        });
      }

      return { error: false, itinerary };
    } catch (error) {
      return { error: true, message: error };
    }
  }
}
