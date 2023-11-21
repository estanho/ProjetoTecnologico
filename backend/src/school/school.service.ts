import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { PrismaService } from '../database/prisma.service';
import { stringToDate } from '../utils/dataConvert';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { UpdateSchoolDto } from '../school/dto/update-school.dto';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { TripsLogicService } from '../trips/tripsLogic.service';

@Injectable()
export class SchoolService {
  constructor(
    private prismaService: PrismaService,
    private itinerariesService: ItinerariesService,
    private tripsLogicService: TripsLogicService,
  ) {}

  async create(user: UserFromJwt, createSchoolDto: CreateSchoolDto) {
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
      // Convertendo datas
      createSchoolDto = stringToDate(createSchoolDto);
      // Verificando Itinerary
      const itinerary = await this.prismaService.itinerary.findFirst({
        where: {
          driver_id: driver.id,
        },
      });
      // Se não existir itinerary, cria um novo
      if (itinerary === null) {
        const newItinerary = await this.itinerariesService.create(user);

        if (newItinerary === null) {
          throw new Error('itinerary_NotGenerated');
        }
      }
      // Criando School
      const school = await this.prismaService.school.create({
        data: {
          name: createSchoolDto.name,
          driver_id: driver.id,
          morning: createSchoolDto.morning,
          morning_arrival: createSchoolDto.morning_arrival,
          morning_departure: createSchoolDto.morning_departure,
          afternoon: createSchoolDto.afternoon,
          afternoon_arrival: createSchoolDto.afternoon_arrival,
          afternoon_departure: createSchoolDto.afternoon_departure,
          night: createSchoolDto.night,
          night_arrival: createSchoolDto.night_arrival,
          night_departure: createSchoolDto.night_departure,
        },
        select: {
          id: true,
        },
      });

      if (school == null) {
        throw new Error('school_Not_Generated');
      }

      const address = await this.prismaService.address.create({
        data: {
          school_address_id: school.id,
          name: createSchoolDto.location.name,
          place_id: createSchoolDto.location.place_id,
          latitude: createSchoolDto.location.latitude,
          longitude: createSchoolDto.location.longitude,
        },
      });

      if (address == null) {
        throw new Error('address_NotGenerated');
      }

      const defaultAddress = await this.prismaService.address.create({
        data: {
          school_default_id: school.id,
          name: createSchoolDto.default_location.name,
          place_id: createSchoolDto.default_location.place_id,
          latitude: createSchoolDto.default_location.latitude,
          longitude: createSchoolDto.default_location.longitude,
        },
      });

      if (defaultAddress == null) {
        throw new Error('defaultAddress_NotGenerated');
      }

      const itinerary_update = await this.itinerariesService.update(user);
      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true || itinerary_update.error === true) {
        await this.prismaService.school.delete({
          where: {
            id: school.id,
          },
        });
        throw new Error('trips_or_itinerary_error');
      }

      return { error: false, school };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

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
      // Pegando itinerary atual
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
      // Pegando escolas
      const data = await this.prismaService.school.findMany({
        where: {
          driver: {
            user_id: user.id,
          },
        },
        select: {
          id: true,
          name: true,
          address: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
              place_id: true,
            },
          },
          default_location: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
              place_id: true,
            },
          },
          status: true,
          morning: true,
          morning_arrival: true,
          morning_departure: true,
          afternoon: true,
          afternoon_arrival: true,
          afternoon_departure: true,
          night: true,
          night_arrival: true,
          night_departure: true,
        },
        orderBy: [{ name: 'asc' }],
      });

      const schools = [];

      data.forEach((item) => {
        const newItem = {
          id: item.id,
          name: item.name,
          address: item.address.name,
          location: {
            id: item.address.id,
            name: item.address.name,
            latitude: item.address.latitude,
            longitude: item.address.longitude,
            place_id: item.address.place_id,
          },
          default_address: item.default_location.name,
          default_location: {
            id: item.default_location.id,
            name: item.default_location.name,
            latitude: item.default_location.latitude,
            longitude: item.default_location.longitude,
            place_id: item.default_location.place_id,
          },
          status: item.status,
          morning: item.morning,
          morning_arrival: item.morning_arrival,
          morning_departure: item.morning_departure,
          afternoon: item.afternoon,
          afternoon_arrival: item.afternoon_arrival,
          afternoon_departure: item.afternoon_departure,
          night: item.night,
          night_arrival: item.night_arrival,
          night_departure: item.night_departure,
        };
        schools.push(newItem);
      });

      return {
        error: false,
        schools,
        started: itinerary?.started === undefined ? false : itinerary.started,
      };
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async update(
    user: UserFromJwt,
    id: string,
    updateSchoolDto: UpdateSchoolDto,
  ) {
    try {
      // Verificando motorista
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!driver) {
        throw new Error('Driver not found');
      }
      // Convertendo datas
      updateSchoolDto = stringToDate(updateSchoolDto);

      const oldSchool = await this.prismaService.school.findFirst({
        where: {
          id: id,
          driver_id: driver.id,
        },
        select: {
          name: true,
          morning: true,
          morning_arrival: true,
          morning_departure: true,
          afternoon: true,
          afternoon_arrival: true,
          afternoon_departure: true,
          night: true,
          night_arrival: true,
          night_departure: true,
          address: {
            select: {
              school_address_id: true,
              name: true,
              place_id: true,
              latitude: true,
              longitude: true,
            },
          },
          default_location: {
            select: {
              school_address_id: true,
              name: true,
              place_id: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      });

      const school = await this.prismaService.school.update({
        where: {
          id: id,
          driver_id: driver.id,
        },
        data: {
          name: updateSchoolDto.name,
          morning: updateSchoolDto.morning,
          morning_arrival: updateSchoolDto.morning_arrival,
          morning_departure: updateSchoolDto.morning_departure,
          afternoon: updateSchoolDto.afternoon,
          afternoon_arrival: updateSchoolDto.afternoon_arrival,
          afternoon_departure: updateSchoolDto.afternoon_departure,
          night: updateSchoolDto.night,
          night_arrival: updateSchoolDto.night_arrival,
          night_departure: updateSchoolDto.night_departure,
          address: {
            update: {
              name: updateSchoolDto.location.name,
              place_id: updateSchoolDto.location.place_id,
              latitude: updateSchoolDto.location.latitude,
              longitude: updateSchoolDto.location.longitude,
            },
          },
          default_location: {
            update: {
              name: updateSchoolDto.default_location.name,
              place_id: updateSchoolDto.default_location.place_id,
              latitude: updateSchoolDto.default_location.latitude,
              longitude: updateSchoolDto.default_location.longitude,
            },
          },
        },
      });

      if (!school) {
        throw new Error('school_NotUpdated');
      }

      const itinerary_update = await this.itinerariesService.update(user);
      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true || itinerary_update.error === true) {
        // Revertendo atualização
        await this.prismaService.school.update({
          where: {
            id: id,
            driver_id: driver.id,
          },
          data: {
            name: oldSchool.name,
            morning: oldSchool.morning,
            morning_arrival: oldSchool.morning_arrival,
            morning_departure: oldSchool.morning_departure,
            afternoon: oldSchool.afternoon,
            afternoon_arrival: oldSchool.afternoon_arrival,
            afternoon_departure: oldSchool.afternoon_departure,
            night: oldSchool.night,
            night_arrival: oldSchool.night_arrival,
            night_departure: oldSchool.night_departure,
            address: {
              update: {
                name: oldSchool.address.name,
                place_id: oldSchool.address.place_id,
                latitude: oldSchool.address.latitude,
                longitude: oldSchool.address.longitude,
              },
            },
            default_location: {
              update: {
                name: oldSchool.default_location.name,
                place_id: oldSchool.default_location.place_id,
                latitude: oldSchool.default_location.latitude,
                longitude: oldSchool.default_location.longitude,
              },
            },
          },
        });

        throw new Error('trips_or_itinerary_error');
      }

      return { error: false, school };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async updateStatus(user: UserFromJwt, id: string, data: { status: boolean }) {
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

      if (!driver) {
        throw new Error('Driver not found');
      }

      const school = await this.prismaService.school.update({
        where: {
          id: id,
          driver_id: driver.id,
        },
        data: {
          status: data.status === true ? false : true,
        },
        select: {
          id: true,
          status: true,
        },
      });

      if (school === null) {
        throw new Error('school_NotUpdated');
      }

      const itinerary_update = await this.itinerariesService.update(user);
      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true || itinerary_update.error === true) {
        await this.prismaService.school.update({
          where: {
            id: id,
            driver_id: driver.id,
          },
          data: {
            status: false,
          },
        });

        throw new Error('trips_or_itinerary_error');
      }

      return { error: false, school };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async remove(user: UserFromJwt, id: string) {
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

      const school = await this.prismaService.school.delete({
        where: {
          id,
          driver: {
            user: {
              id: user.id,
            },
          },
        },
      });

      if (school === null) {
        throw new Error('school_NotDeleted');
      }

      const itinerary_update = await this.itinerariesService.update(user);
      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true || itinerary_update.error === true) {
        throw new Error('trips_or_itinerary_error');
      }

      return { error: false, school };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
