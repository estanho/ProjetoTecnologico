import { Injectable } from '@nestjs/common';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { TripGenerateService } from './services/tripsGenerate.service';
import { PrismaService } from '../database/prisma.service';
import { TripCreateService } from './services/tripsCreate.service';
import { NotificationLogicService } from '../notification/notificationLogic.service';
import moment from 'moment';
import 'moment-timezone';

type updateStatusType = {
  student_id: string;
  driver_id: string;
  type: string;
};

@Injectable()
export class TripsService {
  constructor(
    private prismaService: PrismaService,
    private readonly tripGenerateService: TripGenerateService,
    private readonly tripCreateService: TripCreateService,
    private readonly notificationLogicService: NotificationLogicService,
  ) {}

  async findTripsDriver(user: UserFromJwt) {
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
      // Pega todos os itinerarios
      const itineraries = await this.prismaService.itinerary.findMany({
        where: {
          driver: {
            user_id: user.id,
          },
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
        orderBy: {
          day: 'desc',
        },
        take: 3,
      });
      // Se não existir itinerary sai da função
      if (itineraries === null) {
        throw new Error('no_itinerary');
      }

      const result = [];

      for (let i = 0; i < itineraries.length; i++) {
        const itinerary = itineraries[i];

        const trips = await this.prismaService.trip.findMany({
          where: {
            itinerary_id: itinerary.id,
          },
          select: {
            id: true,
            path: true,
            duration: true,
            estimated: true,
            started_at: true,
            finished_at: true,
            type: true,
            km: true,
            student_trips: {
              select: {
                student: {
                  select: {
                    name: true,
                    goes: true,
                    return: true,
                    address: {
                      select: {
                        name: true,
                      },
                    },
                    responsible_absence_going: {
                      select: {
                        user: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                    responsible_absence_return: {
                      select: {
                        user: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
                order: true,
                absent: true,
                time: true,
                type: true,
                responsible_name: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            estimated: 'asc',
          },
        });

        const newItinerary = {
          id: itinerary.id,
          title: moment(itinerary.day).format('DD/MM/YYYY'),
          trips: [],
          button: [],
        };

        // Informações da Trip
        trips.forEach((item) => {
          const newTrip = {
            id: item.id,
            title: '',
            type: item.type,
            schools: '',
            duration: `${item.duration.toFixed(0)} min`,
            km: `${item.km.toFixed(1)} km`,
            started:
              item.started_at !== null
                ? moment(item.started_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            finished:
              item.finished_at !== null
                ? moment(item.finished_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            recommendation:
              item.type === 'going_morning' ||
              item.type === 'going_afternoon' ||
              item.type === 'going_night'
                ? moment(item.estimated).tz('America/Sao_Paulo').format('HH:mm')
                : '',
            start_time: '',
            end_time: '',
            absents: [],
            events: [],
          };

          if (item.type === 'going_morning') {
            newTrip.title = '🌄 MANHÃ [Ida]';
            newTrip.schools = `${itinerary.school_morning.name}`;
            newTrip.start_time = moment(
              itinerary.school_morning.morning_arrival,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({ name: 'Manhã [Ida]', id: item.id });
          } else if (item.type === 'return_morning') {
            newTrip.title = '🌄 MANHÃ [Volta]';
            newTrip.schools = `${itinerary.school_morning.name}`;
            newTrip.end_time = moment(
              itinerary.school_morning.morning_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({ name: 'Manhã [Volta]', id: item.id });
          } else if (item.type === 'going_afternoon_return_morning') {
            newTrip.title = '🌄 MANHÃ [Volta] -> ⛅ TARDE [Ida]';
            newTrip.schools = `${itinerary.school_morning.name} -> ${itinerary.school_afternoon.name}`;
            newTrip.start_time = moment(
              itinerary.school_afternoon.afternoon_arrival,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newTrip.end_time = moment(
              itinerary.school_morning.morning_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({
              name: 'Manhã [Volta] -> TARDE [Ida]',
              id: item.id,
            });
          } else if (item.type === 'going_afternoon') {
            newTrip.title = '⛅ TARDE [Ida]';
            newTrip.schools = `${itinerary.school_afternoon.name}`;
            newTrip.start_time = moment(
              itinerary.school_afternoon.afternoon_arrival,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({ name: 'TARDE [Ida]', id: item.id });
          } else if (item.type === 'return_afternoon') {
            newTrip.title = '⛅ TARDE [Volta]';
            newTrip.schools = `${itinerary.school_afternoon.name}`;
            newTrip.end_time = moment(
              itinerary.school_afternoon.afternoon_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({ name: 'TARDE [Volta]', id: item.id });
          } else if (item.type === 'going_night_return_afternoon') {
            newTrip.title = '⛅ TARDE [Volta] -> 🌃 NOITE [Ida]';
            newTrip.schools = `${itinerary.school_afternoon.name} -> ${itinerary.school_night.name}`;
            newTrip.start_time = moment(itinerary.school_night.night_arrival)
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newTrip.end_time = moment(
              itinerary.school_afternoon.afternoon_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({
              name: 'TARDE [Volta] -> NOITE [Ida]',
              id: item.id,
            });
          } else if (item.type === 'going_night') {
            newTrip.title = '🌃 NOITE [Ida]';
            newTrip.schools = `${itinerary.school_night.name}`;
            newTrip.start_time = moment(itinerary.school_night.night_arrival)
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({ name: 'NOITE [Ida]', id: item.id });
          } else if (item.type === 'return_night') {
            newTrip.title = '🌃 Noite [Volta]';
            newTrip.schools = `${itinerary.school_night.name}`;
            newTrip.end_time = moment(itinerary.school_night.night_departure)
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newItinerary.button.push({ name: 'NOITE [Volta]', id: item.id });
          }

          for (let i = 0; i < item.student_trips.length; i++) {
            const newEvent = {
              order: -1,
              title: '',
              type: '',
              location: '',
              time: '',
              status: '',
            };

            newEvent.type = item.student_trips[i].type;

            if (i === 0) {
              const start = {
                order: 0,
                title: '• Partida',
                type: '',
                location:
                  item.type === 'going_morning'
                    ? `${itinerary.school_morning.default_location.name}`
                    : item.type === 'return_morning'
                    ? `${itinerary.school_morning.address.name}`
                    : item.type === 'going_afternoon_return_morning'
                    ? `${itinerary.school_morning.address.name}`
                    : item.type === 'going_afternoon'
                    ? `${itinerary.school_afternoon.default_location.name}`
                    : item.type === 'return_afternoon'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'going_night_return_afternoon'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'going_night'
                    ? `${itinerary.school_night.default_location.name}`
                    : item.type === 'return_night'
                    ? `${itinerary.school_night.address.name}`
                    : '',
                time:
                  item.started_at !== null
                    ? moment(item.started_at)
                        .tz('America/Sao_Paulo')
                        .format('HH:mm')
                    : '',
                status: item.started_at === null ? 'upcoming' : 'done',
              };

              newTrip.events.push(start);
            }

            if (item.student_trips[i].absent === true) {
              newTrip.absents.push(
                `• ${item.student_trips[i].student.name} [Responsável: ${item.student_trips[i].responsible_name}]`,
              );
            }

            if (item.student_trips[i].absent === false) {
              newEvent.title = `• ${item.student_trips[i].student.name}`;
              newEvent.location = item.student_trips[i].student.address.name;
              newEvent.order = item.student_trips[i].order;
              newEvent.time =
                item.student_trips[i].time !== null
                  ? moment(item.student_trips[i].time)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '';
              (newEvent.status =
                item.student_trips[i].time === null ? 'upcoming' : 'done'),
                newTrip.events.push(newEvent);
              newEvent.type =
                item.student_trips[i].type === 'going'
                  ? ' - Embarque'
                  : ' - Desembarque';
            }

            if (i === item.student_trips.length - 1) {
              const end = {
                order: item.student_trips.length - newTrip.absents.length + 1,
                title: '• Fim da corrida',
                type: '',
                location:
                  item.type === 'going_morning'
                    ? `${itinerary.school_morning.address.name}`
                    : item.type === 'return_morning'
                    ? `${itinerary.school_morning.default_location.name}`
                    : item.type === 'going_afternoon_return_morning'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'going_afternoon'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'return_afternoon'
                    ? `${itinerary.school_afternoon.default_location.name}`
                    : item.type === 'going_night_return_afternoon'
                    ? `${itinerary.school_night.address.name}`
                    : item.type === 'going_night'
                    ? `${itinerary.school_night.address.name}`
                    : item.type === 'return_night'
                    ? `${itinerary.school_night.default_location.name}`
                    : '',
                time:
                  item.finished_at !== null
                    ? moment(item.finished_at)
                        .tz('America/Sao_Paulo')
                        .format('HH:mm')
                    : '',
                status: item.finished_at === null ? 'upcoming' : 'done',
              };

              newTrip.events.push(end);
            }
          }

          newItinerary.trips.push(newTrip);
        });

        result.push(newItinerary);
      }

      return { error: false, result };
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }
  async findAllDriver(user: UserFromJwt) {
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
      // Pega todos os itinerarios
      const itineraries = await this.prismaService.itinerary.findMany({
        where: {
          driver: {
            user_id: user.id,
          },
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
        orderBy: {
          day: 'desc',
        },
      });
      // Se não existir itinerary sai da função
      if (itineraries === null) {
        throw new Error('no_itinerary');
      }

      const result = [];

      for (let i = 0; i < itineraries.length; i++) {
        const itinerary = itineraries[i];

        const trips = await this.prismaService.trip.findMany({
          where: {
            itinerary_id: itinerary.id,
          },
          select: {
            id: true,
            path: true,
            duration: true,
            estimated: true,
            started_at: true,
            finished_at: true,
            type: true,
            km: true,
            student_trips: {
              select: {
                student: {
                  select: {
                    name: true,
                    goes: true,
                    return: true,
                    address: {
                      select: {
                        name: true,
                      },
                    },
                    responsible_absence_going: {
                      select: {
                        user: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                    responsible_absence_return: {
                      select: {
                        user: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
                order: true,
                absent: true,
                time: true,
                type: true,
                responsible_name: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            estimated: 'asc',
          },
        });

        const newItinerary = {
          id: itinerary.id,
          title: moment(itinerary.day).format('DD/MM/YYYY'),
          trips: [],
        };

        // Informações da Trip
        trips.forEach((item) => {
          const newTrip = {
            id: item.id,
            title: '',
            type: item.type,
            schools: '',
            duration: `${item.duration.toFixed(0)} min`,
            km: `${item.km.toFixed(1)} km`,
            started:
              item.started_at !== null
                ? moment(item.started_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            finished:
              item.finished_at !== null
                ? moment(item.finished_at).format('HH:mm')
                : '',
            recommendation:
              item.type === 'going_morning' ||
              item.type === 'going_afternoon' ||
              item.type === 'going_night'
                ? moment(item.estimated).tz('America/Sao_Paulo').format('HH:mm')
                : '',
            start_time: '',
            end_time: '',
            absents: [],
            events: [],
          };

          if (item.type === 'going_morning') {
            newTrip.title = '🌄 MANHÃ [Ida]';
            newTrip.schools = `${itinerary.school_morning.name}`;
            newTrip.start_time = moment(
              itinerary.school_morning.morning_arrival,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'return_morning') {
            newTrip.title = '🌄 MANHÃ [Volta]';
            newTrip.schools = `${itinerary.school_morning.name}`;
            newTrip.end_time = moment(
              itinerary.school_morning.morning_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'going_afternoon_return_morning') {
            newTrip.title = '🌄 MANHÃ [Volta] -> ⛅ TARDE [Ida]';
            newTrip.schools = `${itinerary.school_morning.name} -> ${itinerary.school_afternoon.name}`;
            newTrip.start_time = moment(
              itinerary.school_afternoon.afternoon_arrival,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newTrip.end_time = moment(
              itinerary.school_morning.morning_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'going_afternoon') {
            newTrip.title = '⛅ TARDE [Ida]';
            newTrip.schools = `${itinerary.school_afternoon.name}`;
            newTrip.start_time = moment(
              itinerary.school_afternoon.afternoon_arrival,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'return_afternoon') {
            newTrip.title = '⛅ TARDE [Volta]';
            newTrip.schools = `${itinerary.school_afternoon.name}`;
            newTrip.end_time = moment(
              itinerary.school_afternoon.afternoon_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'going_night_return_afternoon') {
            newTrip.title = '⛅ TARDE [Volta] -> 🌃 NOITE [Ida]';
            newTrip.schools = `${itinerary.school_afternoon.name} -> ${itinerary.school_night.name}`;
            newTrip.start_time = moment(itinerary.school_night.night_arrival)
              .tz('America/Sao_Paulo')
              .format('HH:mm');
            newTrip.end_time = moment(
              itinerary.school_afternoon.afternoon_departure,
            )
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'going_night') {
            newTrip.title = '🌃 NOITE [Ida]';
            newTrip.schools = `${itinerary.school_night.name}`;
            newTrip.start_time = moment(itinerary.school_night.night_arrival)
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          } else if (item.type === 'return_night') {
            newTrip.title = '🌃 Noite [Volta]';
            newTrip.schools = `${itinerary.school_night.name}`;
            newTrip.end_time = moment(itinerary.school_night.night_departure)
              .tz('America/Sao_Paulo')
              .format('HH:mm');
          }

          for (let i = 0; i < item.student_trips.length; i++) {
            const newEvent = {
              order: -1,
              title: '',
              type: '',
              location: '',
              time: '',
              status: '',
            };

            newEvent.type = item.student_trips[i].type;

            if (i === 0) {
              const start = {
                order: 0,
                title: '• Partida',
                type: '',
                location:
                  item.type === 'going_morning'
                    ? `${itinerary.school_morning.default_location.name}`
                    : item.type === 'return_morning'
                    ? `${itinerary.school_morning.address.name}`
                    : item.type === 'going_afternoon_return_morning'
                    ? `${itinerary.school_morning.address.name}`
                    : item.type === 'going_afternoon'
                    ? `${itinerary.school_afternoon.default_location.name}`
                    : item.type === 'return_afternoon'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'going_night_return_afternoon'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'going_night'
                    ? `${itinerary.school_night.default_location.name}`
                    : item.type === 'return_night'
                    ? `${itinerary.school_night.address.name}`
                    : '',
                time:
                  item.started_at !== null
                    ? moment(item.started_at)
                        .tz('America/Sao_Paulo')
                        .format('HH:mm')
                    : '',
                status: item.started_at === null ? 'upcoming' : 'done',
              };

              newTrip.events.push(start);
            }

            if (item.student_trips[i].absent === true) {
              newTrip.absents.push(
                `• ${item.student_trips[i].student.name} [Responsável: ${item.student_trips[i].responsible_name}]`,
              );
            }

            if (item.student_trips[i].absent === false) {
              newEvent.title = `• ${item.student_trips[i].student.name}`;
              newEvent.location = item.student_trips[i].student.address.name;
              newEvent.order = item.student_trips[i].order;
              newEvent.time =
                item.student_trips[i].time !== null
                  ? moment(item.student_trips[i].time)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '';
              (newEvent.status =
                item.student_trips[i].time === null ? 'upcoming' : 'done'),
                newTrip.events.push(newEvent);
              newEvent.type =
                item.student_trips[i].type === 'going'
                  ? ' - Embarque'
                  : ' - Desembarque';
            }

            if (i === item.student_trips.length - 1) {
              const end = {
                order: item.student_trips.length - newTrip.absents.length + 1,
                title: '• Fim da corrida',
                type: '',
                location:
                  item.type === 'going_morning'
                    ? `${itinerary.school_morning.address.name}`
                    : item.type === 'return_morning'
                    ? `${itinerary.school_morning.default_location.name}`
                    : item.type === 'going_afternoon_return_morning'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'going_afternoon'
                    ? `${itinerary.school_afternoon.address.name}`
                    : item.type === 'return_afternoon'
                    ? `${itinerary.school_afternoon.default_location.name}`
                    : item.type === 'going_night_return_afternoon'
                    ? `${itinerary.school_night.address.name}`
                    : item.type === 'going_night'
                    ? `${itinerary.school_night.address.name}`
                    : item.type === 'return_night'
                    ? `${itinerary.school_night.default_location.name}`
                    : '',
                time:
                  item.finished_at !== null
                    ? moment(item.finished_at)
                        .tz('America/Sao_Paulo')
                        .format('HH:mm')
                    : '',
                status: item.finished_at === null ? 'upcoming' : 'done',
              };

              newTrip.events.push(end);
            }
          }

          newItinerary.trips.push(newTrip);
        });

        result.push(newItinerary);
      }

      return { error: false, result };
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }

  async findTripsResponsible(user: UserFromJwt) {
    try {
      // Verificando Responsible
      const responsible = await this.prismaService.responsible.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });
      if (responsible === null) {
        throw new Error('no_responsible');
      }
      // Verificando Students
      const students = await this.prismaService.student.findMany({
        where: {
          responsibles: {
            some: {
              user_id: user.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          driver: {
            select: {
              user_id: true,
            },
          },
        },
      });
      if (students === null) {
        throw new Error('no_students');
      }
      // Verificando Itineraries
      const itineraries = await this.prismaService.itinerary.findMany({
        where: {
          trips: {
            some: {
              student_trips: {
                some: {
                  student: {
                    id: {
                      in: students.map((student) => student.id),
                    },
                  },
                },
              },
            },
          },
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
        orderBy: {
          day: 'desc',
        },
        take: 3,
      });
      if (itineraries === null) {
        throw new Error('no_itinerary');
      }

      const result = [];

      for (let s = 0; s < students.length; s++) {
        const newStudents = {
          id: students[s].id,
          name: students[s].name,
          driver_id: students[s].driver.user_id,
          itineraries: [],
        };

        for (let i = 0; i < itineraries.length; i++) {
          const itinerary = itineraries[i];

          const newItinerary = {
            id: itinerary.id,
            title: `${moment(itinerary.day).format('DD/MM/YYYY')} `,
            trips: [],
          };

          const trips = await this.prismaService.trip.findMany({
            where: {
              itinerary_id: itinerary.id,
              student_trips: {
                some: {
                  student: {
                    id: students[s].id,
                  },
                },
              },
            },
            select: {
              id: true,
              duration: true,
              estimated: true,
              started_at: true,
              finished_at: true,
              type: true,
              student_trips: {
                where: {
                  student: {
                    id: students[s].id,
                  },
                },
                select: {
                  student: {
                    select: {
                      name: true,
                      address: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  order: true,
                  absent: true,
                  time: true,
                  type: true,
                },
              },
            },
            orderBy: {
              estimated: 'asc',
            },
          });

          // Informações da Trip
          trips.forEach((item) => {
            const newTrip = {
              id: item.id,
              title: '',
              type: item.type,
              schools: '',
              started:
                item.started_at !== null
                  ? moment(item.started_at)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '',
              finished:
                item.finished_at !== null
                  ? moment(item.finished_at)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '',
              start_time: '',
              end_time: '',
              events: [],
            };

            for (let i = 0; i < item.student_trips.length; i++) {
              const newEvent = {
                order: -1,
                title: '',
                type: '',
                location: '',
                time: '',
                status: '',
              };

              newEvent.type = item.student_trips[i].type;

              if (i === 0) {
                if (item.type === 'going_morning') {
                  newTrip.title = '🌄 MANHÃ [Ida]';
                  newTrip.schools = `${itinerary.school_morning.name}`;
                  newTrip.start_time = moment(
                    itinerary.school_morning.morning_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'return_morning') {
                  newTrip.title = '🌄 MANHÃ [Volta]';
                  newTrip.schools = `${itinerary.school_morning.name}`;
                  newTrip.end_time = moment(
                    itinerary.school_morning.morning_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'going_afternoon_return_morning') {
                  if (item.student_trips[i].type === 'going') {
                    newTrip.title = '⛅ TARDE [Ida]';
                    newTrip.schools = itinerary.school_afternoon.name;
                    newTrip.start_time = moment(
                      itinerary.school_afternoon.afternoon_arrival,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  } else if (item.student_trips[i].type === 'return') {
                    newTrip.title = '🌄 MANHÃ [Volta]';
                    newTrip.schools = itinerary.school_morning.name;
                    newTrip.end_time = moment(
                      itinerary.school_morning.morning_departure,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  }
                } else if (item.type === 'going_afternoon') {
                  newTrip.title = '⛅ TARDE [Ida]';
                  newTrip.schools = `${itinerary.school_afternoon.name}`;
                  newTrip.start_time = moment(
                    itinerary.school_afternoon.afternoon_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'return_afternoon') {
                  newTrip.title = '⛅ TARDE [Volta]';
                  newTrip.schools = `${itinerary.school_afternoon.name}`;
                  newTrip.end_time = moment(
                    itinerary.school_afternoon.afternoon_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'going_night_return_afternoon') {
                  if (item.student_trips[i].type === 'going') {
                    newTrip.title = '🌃 Noite [Ida]';
                    newTrip.schools = itinerary.school_night.name;
                    newTrip.start_time = moment(
                      itinerary.school_night.night_arrival,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  } else if (item.student_trips[i].type === 'return') {
                    newTrip.title = '⛅ TARDE [Volta]';
                    newTrip.schools = itinerary.school_afternoon.name;
                    newTrip.end_time = moment(
                      itinerary.school_afternoon.afternoon_departure,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  }
                } else if (item.type === 'going_night') {
                  newTrip.title = '🌃 NOITE [Ida]';
                  newTrip.schools = `${itinerary.school_night.name}`;
                  newTrip.start_time = moment(
                    itinerary.school_night.night_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'return_night') {
                  newTrip.title = '🌃 Noite [Volta]';
                  newTrip.schools = `${itinerary.school_night.name}`;
                  newTrip.end_time = moment(
                    itinerary.school_night.night_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                }

                if (item.student_trips[i].type === 'return') {
                  if (item.student_trips[i].absent === false) {
                    const start = {
                      order: 0,
                      title: '• Corrida Iniciada',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.address.name}`
                          : '',
                      time:
                        item.started_at !== null
                          ? moment(item.started_at)
                              .tz('America/Sao_Paulo')
                              .format('HH:mm')
                          : '',
                      status: item.started_at === null ? 'upcoming' : 'done',
                    };

                    newTrip.events.push(start);
                  } else if (item.student_trips[i].absent === true) {
                    const start = {
                      order: 0,
                      title: '• Corrida Iniciada',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.address.name}`
                          : '',
                      status: 'absent',
                    };

                    newTrip.events.push(start);
                  }
                }
              }

              if (item.student_trips[i].absent === true) {
                newEvent.title = `• ${item.student_trips[i].student.name}`;
                newEvent.location = item.student_trips[i].student.address.name;
                newEvent.status = 'absent';
                newEvent.type =
                  item.student_trips[i].type === 'going'
                    ? ' - Embarque'
                    : ' - Desembarque';
                newTrip.events.push(newEvent);
              }

              if (item.student_trips[i].absent === false) {
                newEvent.title = `• ${item.student_trips[i].student.name}`;
                newEvent.location = item.student_trips[i].student.address.name;
                newEvent.order = item.student_trips[i].order;
                newEvent.time =
                  item.student_trips[i].time !== null
                    ? moment(item.student_trips[i].time)
                        .tz('America/Sao_Paulo')
                        .format('HH:mm')
                    : '';
                (newEvent.status =
                  item.student_trips[i].time === null ? 'upcoming' : 'done'),
                  (newEvent.type =
                    item.student_trips[i].type === 'going'
                      ? ' - Embarque'
                      : ' - Desembarque');
                newTrip.events.push(newEvent);
              }

              if (i === item.student_trips.length - 1) {
                if (item.student_trips[i].type === 'going') {
                  if (item.student_trips[i].absent === false) {
                    const end = {
                      title: '• Fim da corrida',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.default_location.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.default_location.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'going_night'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.default_location.name}`
                          : '',
                      time:
                        item.finished_at !== null
                          ? moment(item.finished_at)
                              .tz('America/Sao_Paulo')
                              .format('HH:mm')
                          : '',
                      status: item.finished_at === null ? 'upcoming' : 'done',
                    };

                    newTrip.events.push(end);
                  } else if (item.student_trips[i].absent === true) {
                    const end = {
                      title: '• Fim da corrida',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.default_location.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.default_location.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'going_night'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.default_location.name}`
                          : '',
                      status: 'absent',
                    };

                    newTrip.events.push(end);
                  }
                }
              }
            }

            newItinerary.trips.push(newTrip);
          });
          newStudents.itineraries.push(newItinerary);
        }

        result.push(newStudents);
      }

      return { error: false, result };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
  async findAllResponsible(user: UserFromJwt) {
    try {
      // Verificando Responsible
      const responsible = await this.prismaService.responsible.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });
      if (responsible === null) {
        throw new Error('no_responsible');
      }
      // Verificando Students
      const students = await this.prismaService.student.findMany({
        where: {
          responsibles: {
            some: {
              user_id: user.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          driver: {
            select: {
              user_id: true,
            },
          },
        },
      });
      if (students === null) {
        throw new Error('no_students');
      }
      // Verificando Itineraries
      const itineraries = await this.prismaService.itinerary.findMany({
        where: {
          trips: {
            some: {
              student_trips: {
                some: {
                  student: {
                    id: {
                      in: students.map((student) => student.id),
                    },
                  },
                },
              },
            },
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
      if (itineraries === null) {
        throw new Error('no_itinerary');
      }

      const result = [];

      for (let s = 0; s < students.length; s++) {
        const newStudents = {
          id: students[s].id,
          name: students[s].name,
          driver_id: students[s].driver.user_id,
          itineraries: [],
        };

        for (let i = 0; i < itineraries.length; i++) {
          const itinerary = itineraries[i];

          const newItinerary = {
            id: itinerary.id,
            title: `${moment(itinerary.day).format('DD/MM/YYYY')} `,
            trips: [],
          };

          const trips = await this.prismaService.trip.findMany({
            where: {
              itinerary_id: itinerary.id,
              student_trips: {
                some: {
                  student: {
                    id: students[s].id,
                  },
                },
              },
            },
            select: {
              id: true,
              duration: true,
              estimated: true,
              started_at: true,
              finished_at: true,
              type: true,
              student_trips: {
                where: {
                  student: {
                    id: students[s].id,
                  },
                },
                select: {
                  student: {
                    select: {
                      name: true,
                      address: {
                        select: {
                          name: true,
                        },
                      },
                    },
                  },
                  order: true,
                  absent: true,
                  time: true,
                  type: true,
                },
              },
            },
            orderBy: {
              estimated: 'asc',
            },
          });

          // Informações da Trip
          trips.forEach((item) => {
            const newTrip = {
              id: item.id,
              title: '',
              type: item.type,
              schools: '',
              started:
                item.started_at !== null
                  ? moment(item.started_at)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '',
              finished:
                item.finished_at !== null
                  ? moment(item.finished_at)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '',
              start_time: '',
              end_time: '',
              events: [],
            };

            for (let i = 0; i < item.student_trips.length; i++) {
              const newEvent = {
                order: -1,
                title: '',
                type: '',
                location: '',
                time: '',
                status: '',
              };

              newEvent.type = item.student_trips[i].type;

              if (i === 0) {
                if (item.type === 'going_morning') {
                  newTrip.title = '🌄 MANHÃ [Ida]';
                  newTrip.schools = `${itinerary.school_morning.name}`;
                  newTrip.start_time = moment(
                    itinerary.school_morning.morning_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'return_morning') {
                  newTrip.title = '🌄 MANHÃ [Volta]';
                  newTrip.schools = `${itinerary.school_morning.name}`;
                  newTrip.end_time = moment(
                    itinerary.school_morning.morning_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'going_afternoon_return_morning') {
                  if (item.student_trips[i].type === 'going') {
                    newTrip.title = '⛅ TARDE [Ida]';
                    newTrip.schools = itinerary.school_afternoon.name;
                    newTrip.start_time = moment(
                      itinerary.school_afternoon.afternoon_arrival,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  } else if (item.student_trips[i].type === 'return') {
                    newTrip.title = '🌄 MANHÃ [Volta]';
                    newTrip.schools = itinerary.school_morning.name;
                    newTrip.end_time = moment(
                      itinerary.school_morning.morning_departure,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  }
                } else if (item.type === 'going_afternoon') {
                  newTrip.title = '⛅ TARDE [Ida]';
                  newTrip.schools = `${itinerary.school_afternoon.name}`;
                  newTrip.start_time = moment(
                    itinerary.school_afternoon.afternoon_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'return_afternoon') {
                  newTrip.title = '⛅ TARDE [Volta]';
                  newTrip.schools = `${itinerary.school_afternoon.name}`;
                  newTrip.end_time = moment(
                    itinerary.school_afternoon.afternoon_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'going_night_return_afternoon') {
                  if (item.student_trips[i].type === 'going') {
                    newTrip.title = '🌃 Noite [Ida]';
                    newTrip.schools = itinerary.school_night.name;
                    newTrip.start_time = moment(
                      itinerary.school_night.night_arrival,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  } else if (item.student_trips[i].type === 'return') {
                    newTrip.title = '⛅ TARDE [Volta]';
                    newTrip.schools = itinerary.school_afternoon.name;
                    newTrip.end_time = moment(
                      itinerary.school_afternoon.afternoon_departure,
                    )
                      .tz('America/Sao_Paulo')
                      .format('HH:mm');
                  }
                } else if (item.type === 'going_night') {
                  newTrip.title = '🌃 NOITE [Ida]';
                  newTrip.schools = `${itinerary.school_night.name}`;
                  newTrip.start_time = moment(
                    itinerary.school_night.night_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.type === 'return_night') {
                  newTrip.title = '🌃 Noite [Volta]';
                  newTrip.schools = `${itinerary.school_night.name}`;
                  newTrip.end_time = moment(
                    itinerary.school_night.night_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                }

                if (item.student_trips[i].type === 'return') {
                  if (item.student_trips[i].absent === false) {
                    const start = {
                      order: 0,
                      title: '• Corrida Iniciada',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.address.name}`
                          : '',
                      time:
                        item.started_at !== null
                          ? moment(item.started_at)
                              .tz('America/Sao_Paulo')
                              .format('HH:mm')
                          : '',
                      status: item.started_at === null ? 'upcoming' : 'done',
                    };

                    newTrip.events.push(start);
                  } else if (item.student_trips[i].absent === true) {
                    const start = {
                      order: 0,
                      title: '• Corrida Iniciada',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'going_afternoon'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_night'
                          ? '- Aguarde o motorista chegar 🚐'
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.address.name}`
                          : '',
                      status: 'absent',
                    };

                    newTrip.events.push(start);
                  }
                }
              }

              if (item.student_trips[i].absent === true) {
                newEvent.title = `• ${item.student_trips[i].student.name}`;
                newEvent.location = item.student_trips[i].student.address.name;
                newEvent.status = 'absent';
                newEvent.type =
                  item.student_trips[i].type === 'going'
                    ? ' - Embarque'
                    : ' - Desembarque';
                newTrip.events.push(newEvent);
              }

              if (item.student_trips[i].absent === false) {
                newEvent.title = `• ${item.student_trips[i].student.name}`;
                newEvent.location = item.student_trips[i].student.address.name;
                newEvent.order = item.student_trips[i].order;
                newEvent.time =
                  item.student_trips[i].time !== null
                    ? moment(item.student_trips[i].time)
                        .tz('America/Sao_Paulo')
                        .format('HH:mm')
                    : '';
                (newEvent.status =
                  item.student_trips[i].time === null ? 'upcoming' : 'done'),
                  (newEvent.type =
                    item.student_trips[i].type === 'going'
                      ? ' - Embarque'
                      : ' - Desembarque');
                newTrip.events.push(newEvent);
              }

              if (i === item.student_trips.length - 1) {
                if (item.student_trips[i].type === 'going') {
                  if (item.student_trips[i].absent === false) {
                    const end = {
                      title: '• Fim da corrida',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.default_location.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.default_location.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'going_night'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.default_location.name}`
                          : '',
                      time:
                        item.finished_at !== null
                          ? moment(item.finished_at)
                              .tz('America/Sao_Paulo')
                              .format('HH:mm')
                          : '',
                      status: item.finished_at === null ? 'upcoming' : 'done',
                    };

                    newTrip.events.push(end);
                  } else if (item.student_trips[i].absent === true) {
                    const end = {
                      title: '• Fim da corrida',
                      type: '',
                      location:
                        item.type === 'going_morning'
                          ? `${itinerary.school_morning.address.name}`
                          : item.type === 'return_morning'
                          ? `${itinerary.school_morning.default_location.name}`
                          : item.type === 'going_afternoon_return_morning'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'going_afternoon'
                          ? `${itinerary.school_afternoon.address.name}`
                          : item.type === 'return_afternoon'
                          ? `${itinerary.school_afternoon.default_location.name}`
                          : item.type === 'going_night_return_afternoon'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'going_night'
                          ? `${itinerary.school_night.address.name}`
                          : item.type === 'return_night'
                          ? `${itinerary.school_night.default_location.name}`
                          : '',
                      status: 'absent',
                    };

                    newTrip.events.push(end);
                  }
                }
              }
            }

            newItinerary.trips.push(newTrip);
          });
          newStudents.itineraries.push(newItinerary);
        }

        result.push(newStudents);
      }

      return { error: false, result };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findTripsStudent(user: UserFromJwt) {
    try {
      // Verificando Student
      const student = await this.prismaService.student.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });
      if (student === null) {
        throw new Error('no_student');
      }

      const student_info = await this.prismaService.student.findFirst({
        where: {
          user: {
            id: user.id,
          },
        },
        select: {
          id: true,
          name: true,
          driver: {
            select: {
              user_id: true,
            },
          },
        },
      });
      // Se não existir student sai da função
      if (student_info === null) {
        throw new Error('no_studentInfo');
      }
      const itineraries = await this.prismaService.itinerary.findMany({
        where: {
          trips: {
            some: {
              student_trips: {
                some: {
                  student: {
                    id: student_info.id,
                  },
                },
              },
            },
          },
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
        orderBy: {
          day: 'desc',
        },
        take: 3,
      });
      // Se não existir itinerary sai da função
      if (itineraries === null) {
        throw new Error('no_itinerary');
      }

      const result = [];

      const newStudent = {
        id: student.id,
        name: student_info.name,
        driver_id: student_info.driver.user_id,
        itineraries: [],
      };

      for (let i = 0; i < itineraries.length; i++) {
        const itinerary = itineraries[i];

        const newItinerary = {
          id: itinerary.id,
          title: `${moment(itinerary.day).format('DD/MM/YYYY')} `,
          trips: [],
        };

        const trips = await this.prismaService.trip.findMany({
          where: {
            itinerary_id: itinerary.id,
            student_trips: {
              some: {
                student: {
                  id: student_info.id,
                },
              },
            },
          },
          select: {
            id: true,
            duration: true,
            estimated: true,
            started_at: true,
            finished_at: true,
            type: true,
            student_trips: {
              where: {
                student: {
                  id: student_info.id,
                },
              },
              select: {
                student: {
                  select: {
                    name: true,
                    address: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                order: true,
                absent: true,
                time: true,
                type: true,
              },
            },
          },
          orderBy: {
            estimated: 'asc',
          },
        });

        // Informações da Trip
        trips.forEach((item) => {
          const newTrip = {
            id: item.id,
            title: '',
            type: item.type,
            schools: '',
            started:
              item.started_at !== null
                ? moment(item.started_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            finished:
              item.finished_at !== null
                ? moment(item.finished_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            start_time: '',
            end_time: '',
            events: [],
          };

          for (let i = 0; i < item.student_trips.length; i++) {
            const newEvent = {
              order: -1,
              title: '',
              type: '',
              location: '',
              time: '',
              status: '',
            };

            newEvent.type = item.student_trips[i].type;

            if (i === 0) {
              if (item.type === 'going_morning') {
                newTrip.title = '🌄 MANHÃ [Ida]';
                newTrip.schools = `${itinerary.school_morning.name}`;
                newTrip.start_time = moment(
                  itinerary.school_morning.morning_arrival,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'return_morning') {
                newTrip.title = '🌄 MANHÃ [Volta]';
                newTrip.schools = `${itinerary.school_morning.name}`;
                newTrip.end_time = moment(
                  itinerary.school_morning.morning_departure,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'going_afternoon_return_morning') {
                if (item.student_trips[i].type === 'going') {
                  newTrip.title = '⛅ TARDE [Ida]';
                  newTrip.schools = itinerary.school_afternoon.name;
                  newTrip.start_time = moment(
                    itinerary.school_afternoon.afternoon_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.student_trips[i].type === 'return') {
                  newTrip.title = '🌄 MANHÃ [Volta]';
                  newTrip.schools = itinerary.school_morning.name;
                  newTrip.end_time = moment(
                    itinerary.school_morning.morning_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                }
              } else if (item.type === 'going_afternoon') {
                newTrip.title = '⛅ TARDE [Ida]';
                newTrip.schools = `${itinerary.school_afternoon.name}`;
                newTrip.start_time = moment(
                  itinerary.school_afternoon.afternoon_arrival,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'return_afternoon') {
                newTrip.title = '⛅ TARDE [Volta]';
                newTrip.schools = `${itinerary.school_afternoon.name}`;
                newTrip.end_time = moment(
                  itinerary.school_afternoon.afternoon_departure,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'going_night_return_afternoon') {
                if (item.student_trips[i].type === 'going') {
                  newTrip.title = '🌃 Noite [Ida]';
                  newTrip.schools = itinerary.school_night.name;
                  newTrip.start_time = moment(
                    itinerary.school_night.night_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.student_trips[i].type === 'return') {
                  newTrip.title = '⛅ TARDE [Volta]';
                  newTrip.schools = itinerary.school_afternoon.name;
                  newTrip.end_time = moment(
                    itinerary.school_afternoon.afternoon_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                }
              } else if (item.type === 'going_night') {
                newTrip.title = '🌃 NOITE [Ida]';
                newTrip.schools = `${itinerary.school_night.name}`;
                newTrip.start_time = moment(
                  itinerary.school_night.night_arrival,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'return_night') {
                newTrip.title = '🌃 Noite [Volta]';
                newTrip.schools = `${itinerary.school_night.name}`;
                newTrip.end_time = moment(
                  itinerary.school_night.night_departure,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              }

              if (item.student_trips[i].type === 'return') {
                if (item.student_trips[i].absent === false) {
                  const start = {
                    order: 0,
                    title: '• Corrida Iniciada',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.address.name}`
                        : '',
                    time:
                      item.started_at !== null
                        ? moment(item.started_at)
                            .tz('America/Sao_Paulo')
                            .format('HH:mm')
                        : '',
                    status: item.started_at === null ? 'upcoming' : 'done',
                  };

                  newTrip.events.push(start);
                } else if (item.student_trips[i].absent === true) {
                  const start = {
                    order: 0,
                    title: '• Corrida Iniciada',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.address.name}`
                        : '',
                    status: 'absent',
                  };

                  newTrip.events.push(start);
                }
              }
            }

            if (item.student_trips[i].absent === true) {
              newEvent.title = `• ${item.student_trips[i].student.name}`;
              newEvent.location = item.student_trips[i].student.address.name;
              newEvent.status = 'absent';
              newEvent.type =
                item.student_trips[i].type === 'going'
                  ? ' - Embarque'
                  : ' - Desembarque';
              newTrip.events.push(newEvent);
            }

            if (item.student_trips[i].absent === false) {
              newEvent.title = `• ${item.student_trips[i].student.name}`;
              newEvent.location = item.student_trips[i].student.address.name;
              newEvent.order = item.student_trips[i].order;
              newEvent.time =
                item.student_trips[i].time !== null
                  ? moment(item.student_trips[i].time)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '';
              (newEvent.status =
                item.student_trips[i].time === null ? 'upcoming' : 'done'),
                (newEvent.type =
                  item.student_trips[i].type === 'going'
                    ? ' - Embarque'
                    : ' - Desembarque');
              newTrip.events.push(newEvent);
            }

            if (i === item.student_trips.length - 1) {
              if (item.student_trips[i].type === 'going') {
                if (item.student_trips[i].absent === false) {
                  const end = {
                    title: '• Fim da corrida',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.default_location.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.default_location.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'going_night'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.default_location.name}`
                        : '',
                    time:
                      item.finished_at !== null
                        ? moment(item.finished_at)
                            .tz('America/Sao_Paulo')
                            .format('HH:mm')
                        : '',
                    status: item.finished_at === null ? 'upcoming' : 'done',
                  };

                  newTrip.events.push(end);
                } else if (item.student_trips[i].absent === true) {
                  const end = {
                    title: '• Fim da corrida',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.default_location.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.default_location.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'going_night'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.default_location.name}`
                        : '',
                    status: 'absent',
                  };

                  newTrip.events.push(end);
                }
              }
            }
          }

          newItinerary.trips.push(newTrip);
        });
        newStudent.itineraries.push(newItinerary);
      }

      result.push(newStudent);

      return { error: false, result };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
  async findAllStudent(user: UserFromJwt) {
    try {
      // Verificando Student
      const student = await this.prismaService.student.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });
      if (student === null) {
        throw new Error('no_student');
      }

      const student_info = await this.prismaService.student.findFirst({
        where: {
          user: {
            id: user.id,
          },
        },
        select: {
          id: true,
          name: true,
          driver: {
            select: {
              user_id: true,
            },
          },
        },
      });
      // Se não existir student sai da função
      if (student_info === null) {
        throw new Error('no_studentInfo');
      }
      const itineraries = await this.prismaService.itinerary.findMany({
        where: {
          trips: {
            some: {
              student_trips: {
                some: {
                  student: {
                    id: student_info.id,
                  },
                },
              },
            },
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
      // Se não existir itinerary sai da função
      if (itineraries === null) {
        throw new Error('no_itinerary');
      }

      const result = [];

      const newStudent = {
        id: student.id,
        name: student_info.name,
        driver_id: student_info.driver.user_id,
        itineraries: [],
      };

      for (let i = 0; i < itineraries.length; i++) {
        const itinerary = itineraries[i];

        const newItinerary = {
          id: itinerary.id,
          title: `${moment(itinerary.day).format('DD/MM/YYYY')} `,
          trips: [],
        };

        const trips = await this.prismaService.trip.findMany({
          where: {
            itinerary_id: itinerary.id,
            student_trips: {
              some: {
                student: {
                  id: student_info.id,
                },
              },
            },
          },
          select: {
            id: true,
            duration: true,
            estimated: true,
            started_at: true,
            finished_at: true,
            type: true,
            student_trips: {
              where: {
                student: {
                  id: student_info.id,
                },
              },
              select: {
                student: {
                  select: {
                    name: true,
                    address: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                order: true,
                absent: true,
                time: true,
                type: true,
              },
            },
          },
          orderBy: {
            estimated: 'asc',
          },
        });

        // Informações da Trip
        trips.forEach((item) => {
          const newTrip = {
            id: item.id,
            title: '',
            type: item.type,
            schools: '',
            started:
              item.started_at !== null
                ? moment(item.started_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            finished:
              item.finished_at !== null
                ? moment(item.finished_at)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '',
            start_time: '',
            end_time: '',
            events: [],
          };

          for (let i = 0; i < item.student_trips.length; i++) {
            const newEvent = {
              order: -1,
              title: '',
              type: '',
              location: '',
              time: '',
              status: '',
            };

            newEvent.type = item.student_trips[i].type;

            if (i === 0) {
              if (item.type === 'going_morning') {
                newTrip.title = '🌄 MANHÃ [Ida]';
                newTrip.schools = `${itinerary.school_morning.name}`;
                newTrip.start_time = moment(
                  itinerary.school_morning.morning_arrival,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'return_morning') {
                newTrip.title = '🌄 MANHÃ [Volta]';
                newTrip.schools = `${itinerary.school_morning.name}`;
                newTrip.end_time = moment(
                  itinerary.school_morning.morning_departure,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'going_afternoon_return_morning') {
                if (item.student_trips[i].type === 'going') {
                  newTrip.title = '⛅ TARDE [Ida]';
                  newTrip.schools = itinerary.school_afternoon.name;
                  newTrip.start_time = moment(
                    itinerary.school_afternoon.afternoon_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.student_trips[i].type === 'return') {
                  newTrip.title = '🌄 MANHÃ [Volta]';
                  newTrip.schools = itinerary.school_morning.name;
                  newTrip.end_time = moment(
                    itinerary.school_morning.morning_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                }
              } else if (item.type === 'going_afternoon') {
                newTrip.title = '⛅ TARDE [Ida]';
                newTrip.schools = `${itinerary.school_afternoon.name}`;
                newTrip.start_time = moment(
                  itinerary.school_afternoon.afternoon_arrival,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'return_afternoon') {
                newTrip.title = '⛅ TARDE [Volta]';
                newTrip.schools = `${itinerary.school_afternoon.name}`;
                newTrip.end_time = moment(
                  itinerary.school_afternoon.afternoon_departure,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'going_night_return_afternoon') {
                if (item.student_trips[i].type === 'going') {
                  newTrip.title = '🌃 Noite [Ida]';
                  newTrip.schools = itinerary.school_night.name;
                  newTrip.start_time = moment(
                    itinerary.school_night.night_arrival,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                } else if (item.student_trips[i].type === 'return') {
                  newTrip.title = '⛅ TARDE [Volta]';
                  newTrip.schools = itinerary.school_afternoon.name;
                  newTrip.end_time = moment(
                    itinerary.school_afternoon.afternoon_departure,
                  )
                    .tz('America/Sao_Paulo')
                    .format('HH:mm');
                }
              } else if (item.type === 'going_night') {
                newTrip.title = '🌃 NOITE [Ida]';
                newTrip.schools = `${itinerary.school_night.name}`;
                newTrip.start_time = moment(
                  itinerary.school_night.night_arrival,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              } else if (item.type === 'return_night') {
                newTrip.title = '🌃 Noite [Volta]';
                newTrip.schools = `${itinerary.school_night.name}`;
                newTrip.end_time = moment(
                  itinerary.school_night.night_departure,
                )
                  .tz('America/Sao_Paulo')
                  .format('HH:mm');
              }

              if (item.student_trips[i].type === 'return') {
                if (item.student_trips[i].absent === false) {
                  const start = {
                    order: 0,
                    title: '• Corrida Iniciada',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.address.name}`
                        : '',
                    time:
                      item.started_at !== null
                        ? moment(item.started_at)
                            .tz('America/Sao_Paulo')
                            .format('HH:mm')
                        : '',
                    status: item.started_at === null ? 'upcoming' : 'done',
                  };

                  newTrip.events.push(start);
                } else if (item.student_trips[i].absent === true) {
                  const start = {
                    order: 0,
                    title: '• Corrida Iniciada',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'going_afternoon'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_night'
                        ? '- Aguarde o motorista chegar 🚐'
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.address.name}`
                        : '',
                    status: 'absent',
                  };

                  newTrip.events.push(start);
                }
              }
            }

            if (item.student_trips[i].absent === true) {
              newEvent.title = `• ${item.student_trips[i].student.name}`;
              newEvent.location = item.student_trips[i].student.address.name;
              newEvent.status = 'absent';
              newEvent.type =
                item.student_trips[i].type === 'going'
                  ? ' - Embarque'
                  : ' - Desembarque';
              newTrip.events.push(newEvent);
            }

            if (item.student_trips[i].absent === false) {
              newEvent.title = `• ${item.student_trips[i].student.name}`;
              newEvent.location = item.student_trips[i].student.address.name;
              newEvent.order = item.student_trips[i].order;
              newEvent.time =
                item.student_trips[i].time !== null
                  ? moment(item.student_trips[i].time)
                      .tz('America/Sao_Paulo')
                      .format('HH:mm')
                  : '';
              (newEvent.status =
                item.student_trips[i].time === null ? 'upcoming' : 'done'),
                (newEvent.type =
                  item.student_trips[i].type === 'going'
                    ? ' - Embarque'
                    : ' - Desembarque');
              newTrip.events.push(newEvent);
            }

            if (i === item.student_trips.length - 1) {
              if (item.student_trips[i].type === 'going') {
                if (item.student_trips[i].absent === false) {
                  const end = {
                    title: '• Fim da corrida',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.default_location.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.default_location.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'going_night'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.default_location.name}`
                        : '',
                    time:
                      item.finished_at !== null
                        ? moment(item.finished_at)
                            .tz('America/Sao_Paulo')
                            .format('HH:mm')
                        : '',
                    status: item.finished_at === null ? 'upcoming' : 'done',
                  };

                  newTrip.events.push(end);
                } else if (item.student_trips[i].absent === true) {
                  const end = {
                    title: '• Fim da corrida',
                    type: '',
                    location:
                      item.type === 'going_morning'
                        ? `${itinerary.school_morning.address.name}`
                        : item.type === 'return_morning'
                        ? `${itinerary.school_morning.default_location.name}`
                        : item.type === 'going_afternoon_return_morning'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'going_afternoon'
                        ? `${itinerary.school_afternoon.address.name}`
                        : item.type === 'return_afternoon'
                        ? `${itinerary.school_afternoon.default_location.name}`
                        : item.type === 'going_night_return_afternoon'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'going_night'
                        ? `${itinerary.school_night.address.name}`
                        : item.type === 'return_night'
                        ? `${itinerary.school_night.default_location.name}`
                        : '',
                    status: 'absent',
                  };

                  newTrip.events.push(end);
                }
              }
            }
          }

          newItinerary.trips.push(newTrip);
        });
        newStudent.itineraries.push(newItinerary);
      }

      result.push(newStudent);

      return { error: false, result };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async updateTripStudent(
    user: UserFromJwt,
    id: string,
    data: updateStatusType,
  ) {
    try {
      // Verificando Responsible
      const responsible = await this.prismaService.responsible.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      if (responsible === null) {
        throw new Error('no_responsible');
      }
      // Verificando Driver
      const driver = await this.prismaService.driver.findFirst({
        where: {
          user_id: data.driver_id,
        },
      });
      if (driver === null) {
        throw new Error('no_driver');
      }
      // Verificando Student
      const student = await this.prismaService.student.findFirst({
        where: {
          id: data.student_id,
          responsibles: {
            some: {
              user_id: user.id,
            },
          },
        },
      });
      if (student === null) {
        throw new Error('no_student');
      }
      // Verificando Trip
      const trip = await this.prismaService.trip.findFirst({
        where: {
          id,
          started_at: null,
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }

      if (data.type === 'going') {
        if (student.goes === true) {
          await this.prismaService.student.update({
            where: {
              id: student.id,
            },
            data: {
              responsible_absence_going: {
                connect: {
                  user_id: user.id,
                },
              },
            },
          });
        } else if (student.goes === false) {
          await this.prismaService.student.update({
            where: {
              id: student.id,
            },
            data: {
              responsible_absence_going: {
                disconnect: {
                  id: student.responsible_absence_going_id,
                },
              },
            },
          });
        }
      } else if (data.type === 'return') {
        if (student.return === true) {
          await this.prismaService.student.update({
            where: {
              id: student.id,
            },
            data: {
              responsible_absence_return: {
                connect: {
                  user_id: user.id,
                },
              },
            },
          });
        } else if (student.return === false) {
          await this.prismaService.student.update({
            where: {
              id: student.id,
            },
            data: {
              responsible_absence_return: {
                disconnect: {
                  id: student.responsible_absence_return_id,
                },
              },
            },
          });
        }
      }

      await this.prismaService.student.update({
        where: {
          id: student.id,
        },
        data: {
          goes: data.type === 'going' ? !student.goes : student.goes,
          return: data.type === 'return' ? !student.return : student.return,
        },
      });

      if (trip.type === 'going_morning') {
        // Gerando Rota de Ida da Manhã
        const aux_morningGoingTrip =
          await this.tripGenerateService.generateTrip(
            driver.user_id,
            'morning',
            'going',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_morningGoingTrip.error === true) {
          throw new Error('Erro na Geração - (Manhã - Ida)');
        }
        // Criando rota de Ida da Manhã
        const aux_trip = await this.tripCreateService.createTrip(
          aux_morningGoingTrip,
          'morning',
          'going_morning',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Manhã - Ida)');
        }
      } else if (trip.type === 'return_morning') {
        // Gerando Rota de Volta da Manhã
        const aux_morningReturnTrip =
          await this.tripGenerateService.generateTrip(
            driver.user_id,
            'morning',
            'return',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_morningReturnTrip.error === true) {
          throw new Error('Erro na Geração - (Manhã - Volta)');
        }
        // Criando Rota de Volta da Manhã
        const aux_trip = await this.tripCreateService.createTrip(
          aux_morningReturnTrip,
          'morning',
          'return_morning',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Manhã - Volta)');
        }
      } else if (trip.type === 'going_afternoon_return_morning') {
        // Gerando rota de Volta da Manhã
        const morningReturn = await this.tripGenerateService.generateTrip(
          driver.user_id,
          'morning',
          'return',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (morningReturn.error === true) {
          throw new Error('Erro na Geração Mesclada - (Manhã - Volta)');
        }
        // Gerando rota de Ida da Tarde
        const afternoonGoing = await this.tripGenerateService.generateTrip(
          driver.user_id,
          'afternoon',
          'going',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (afternoonGoing.error === true) {
          throw new Error('Erro na Geração Mesclada - (Tarde - Ida)');
        }
        // Gerando a rota mesclada de Manhã e Tarde
        const aux_morningAfternoonTrip =
          await this.tripGenerateService.generateMixTrip(
            morningReturn,
            afternoonGoing,
            'morning_afternoon',
          );
        //Se encontrar erro ao gerar a rota, sai da função
        if (aux_morningAfternoonTrip.error === true) {
          throw new Error('Erro na Geração Mesclada - (Mix)');
        }
        // Criando rota de GOING_AFTERNOON_RETURN_MORNING
        const aux_trip = await this.tripCreateService.createTrip(
          aux_morningAfternoonTrip,
          'morning_afternoon',
          'going_afternoon_return_morning',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Manhã e Tarde)');
        }
      } else if (trip.type === 'going_afternoon') {
        // Gerando Rota de Ida da Tarde
        const aux_afternoonGoingTrip =
          await this.tripGenerateService.generateTrip(
            driver.user_id,
            'afternoon',
            'going',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_afternoonGoingTrip.error === true) {
          throw new Error('Erro na Geração - (Tarde - Ida)');
        }
        // Criando Rota de Ida da Tarde
        const aux_trip = await this.tripCreateService.createTrip(
          aux_afternoonGoingTrip,
          'afternoon',
          'going_afternoon',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Tarde - Ida)');
        }
      } else if (trip.type === 'return_afternoon') {
        // Gerando Rota de Volta da Tarde
        const aux_afternoonReturnTrip =
          await this.tripGenerateService.generateTrip(
            driver.user_id,
            'afternoon',
            'return',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_afternoonReturnTrip.error === true) {
          throw new Error('Erro na Geração - (Tarde - Volta)');
        }
        // Criando Rota de Volta da Tarde
        const aux_trip = await this.tripCreateService.createTrip(
          aux_afternoonReturnTrip,
          'afternoon',
          'return_afternoon',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Tarde - Volta)');
        }
      } else if (trip.type === 'going_night_return_afternoon') {
        // Gerando rota de Volta da Tarde
        const afternoonReturn = await this.tripGenerateService.generateTrip(
          driver.user_id,
          'afternoon',
          'return',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (afternoonReturn.error === true) {
          throw new Error('Erro na Geração Mesclada - (Tarde - Volta)');
        }
        // Gerando rota de Ida da Noite
        const nightGoing = await this.tripGenerateService.generateTrip(
          driver.user_id,
          'night',
          'going',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (nightGoing.error === true) {
          throw new Error('Erro na Geração Mesclada - (Noite - Ida)');
        }
        // Gerando a rota mesclada de Tarde e Noite
        const aux_afternoonNightTrip =
          await this.tripGenerateService.generateMixTrip(
            afternoonReturn,
            nightGoing,
            'afternoon_night',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_afternoonNightTrip.error === true) {
          throw new Error('Erro na Geração Mesclada - (Mix)');
        }
        // Criando rota de GOING_NIGHT_RETURN_AFTERNOON
        const aux_trip = await this.tripCreateService.createTrip(
          aux_afternoonNightTrip,
          'afternoon_night',
          'going_night_return_afternoon',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Tarde e Noite)');
        }
      } else if (trip.type === 'going_night') {
        // Gerando Rota de Ida da Noite
        const aux_nightGoingTrip = await this.tripGenerateService.generateTrip(
          driver.user_id,
          'night',
          'going',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_nightGoingTrip.error === true) {
          throw new Error('Erro na Geração - (Noite - Ida)');
        }
        // Criando Rota de Ida da Noite
        const aux_trip = await this.tripCreateService.createTrip(
          aux_nightGoingTrip,
          'night',
          'going_night',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Noite - Ida)');
        }
      } else if (trip.type === 'return_night') {
        // Gerando Rota de Ida da Manhã
        const aux_nightReturnTrip = await this.tripGenerateService.generateTrip(
          driver.user_id,
          'night',
          'return',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_nightReturnTrip.error === true) {
          throw new Error('Erro na Geração - (Noite - Volta)');
        }
        // Criando rota de Volta da Tarde
        const aux_trip = await this.tripCreateService.createTrip(
          aux_nightReturnTrip,
          'night',
          'return_night',
          trip.itinerary_id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (aux_trip.error === true) {
          throw new Error('Erro na Criação - (Noite - Volta)');
        }
      }

      await this.prismaService.trip.delete({
        where: {
          id: trip.id,
        },
      });

      // Criando e enviando notificação
      await this.notificationLogicService.create({
        type:
          data.type === 'going'
            ? `${data.type}_${!student.goes}`
            : `${data.type}_${!student.return}`,
        student_id: student.id,
        user_id: driver.user_id,
        name: responsible.user.name,
        name_student: student.name,
      });

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
