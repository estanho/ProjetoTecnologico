import { Injectable } from '@nestjs/common';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
import { TripsLogicService } from '../trips/tripsLogic.service';

@Injectable()
export class ItinerariesService {
  constructor(
    private prismaService: PrismaService,
    private tripsLogicService: TripsLogicService,
  ) {}

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

  async createAfterFinishing(user: UserFromJwt) {
    try {
      // Verifica Driver
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: user.id,
        },
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
      if (driver === null) {
        throw new Error('no_driver');
      }

      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);

      // Verifica se é dia de semana e ajusta para o proximo dia util
      if (nextDay.getDay() === 6 || nextDay.getDay() === 0) {
        while (nextDay.getDay() !== 1) {
          nextDay.setDate(nextDay.getDate() + 1);
        }
      }

      // Verifica itinerario
      const existsItinerary = await this.prismaService.itinerary.findFirst({
        where: {
          day: nextDay,
          driver_id: driver.id,
        },
      });
      if (existsItinerary !== null) {
        console.log('Já existe itinerario para data.');
      } else {
        // Criando itinerario
        const itinerary = await this.prismaService.itinerary.create({
          data: {
            day: nextDay,
            driver: {
              connect: {
                id: driver.id,
              },
            },
          },
        });

        const school_morning = await this.prismaService.school.findFirst({
          where: {
            driver_id: driver.id,
            morning: true,
            status: true,
          },
          select: {
            id: true,
          },
        });

        const school_afternoon = await this.prismaService.school.findFirst({
          where: {
            driver_id: driver.id,
            afternoon: true,
            status: true,
          },
          select: {
            id: true,
          },
        });

        const school_night = await this.prismaService.school.findFirst({
          where: {
            driver_id: driver.id,
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
          id: driver.user.id,
          email: driver.user.email,
          role: 'DriverRole',
        };
        // Criando as trips
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

      return { error: false, itineraries: true };
    } catch (error) {
      console.log(error);
      return { error: true, itineraries: false };
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
