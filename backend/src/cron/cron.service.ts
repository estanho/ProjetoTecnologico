import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TripsLogicService } from '../trips/tripsLogic.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(
    private prismaService: PrismaService,
    private tripsLogicService: TripsLogicService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handler() {
    try {
      const drivers = await this.prismaService.driver.findMany({
        select: {
          id: true,
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      if (drivers === null) {
        throw new Error('Não foram encontrados motoristas');
      }

      // Verifica o dia de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Verifica se é dia de semana
      if (today.getDay() === 6 || today.getDay() === 0) {
        // Ajusta para o proximo dia util
        while (today.getDay() !== 1) {
          today.setDate(today.getDate() + 1);
        }
      }

      // Percorre por todos os motoristas
      for (let i = 0; i < drivers.length; i++) {
        // Verifica se já existe itinerario pra data atual
        const existsItinerary = await this.prismaService.itinerary.findFirst({
          where: {
            day: today,
            driver_id: drivers[i].id,
          },
        });

        if (existsItinerary !== null) {
          console.log('Já existe itinerario para data.');
        } else {
          const itinerary = await this.prismaService.itinerary.create({
            data: {
              day: today,
              driver: {
                connect: {
                  id: drivers[i].id,
                },
              },
            },
          });

          const school_morning = await this.prismaService.school.findFirst({
            where: {
              driver_id: drivers[i].id,
              morning: true,
              status: true,
            },
            select: {
              id: true,
            },
          });

          const school_afternoon = await this.prismaService.school.findFirst({
            where: {
              driver_id: drivers[i].id,
              afternoon: true,
              status: true,
            },
            select: {
              id: true,
            },
          });

          const school_night = await this.prismaService.school.findFirst({
            where: {
              driver_id: drivers[i].id,
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

          const user = {
            id: drivers[i].user.id,
            email: drivers[i].user.email,
            role: 'DriverRole',
          };

          const trips = await this.tripsLogicService.create(user);

          if (trips.error === true) {
            await this.prismaService.itinerary.delete({
              where: {
                id: itinerary.id,
              },
            });
            return { error: true, message: trips.message };
          }
        }
      }

      return { error: false, itineraries: true };
    } catch (error) {
      console.log(error);
      return { error: true, itineraries: false };
    }
  }
}
