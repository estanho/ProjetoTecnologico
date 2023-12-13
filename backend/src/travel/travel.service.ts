import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
import { ItinerariesService } from '../itineraries/itineraries.service';
import { NotificationLogicService } from '../notification/notificationLogic.service';
import 'moment-timezone';

@Injectable()
export class TravelService {
  constructor(
    private prismaService: PrismaService,
    private itinerariesService: ItinerariesService,
    private readonly notificationLogicService: NotificationLogicService,
  ) {}

  async findTripCurrent(user: UserFromJwt) {
    try {
      // Pega o itinerario atual
      const itinerary = await this.prismaService.itinerary.findFirst({
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
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }

      let result = {};

      const trip = await this.prismaService.trip.findFirst({
        where: {
          itinerary_id: itinerary.id,
          finished_at: null,
        },
        select: {
          id: true,
          rollCall: true,
          path: true,
          duration: true,
          estimated: true,
          started_at: true,
          finished_at: true,
          type: true,
          km: true,
          student_trips: {
            where: {
              time: null,
            },
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
      if (trip === null) {
        return { error: false, result };
      }

      const newItinerary = {
        id: itinerary.id,
        title: moment(itinerary.day).format('DD/MM/YYYY'),
        day: itinerary.day,
        trip: {},
      };

      // Informações da Trip
      const newTrip = {
        id: trip.id,
        title: '',
        type: trip.type,
        rollCall: trip.rollCall,
        schools: '',
        started:
          trip.started_at !== null
            ? moment(trip.started_at).tz('America/Sao_Paulo').format('HH:mm')
            : '',
        finished:
          trip.finished_at !== null
            ? moment(trip.finished_at).tz('America/Sao_Paulo').format('HH:mm')
            : '',
        start_time: '',
        end_time: '',
        absents: [],
        events: [],
      };

      if (trip.type === 'going_morning') {
        newTrip.title = '🌄 MANHÃ [Ida]';
        newTrip.schools = `${itinerary.school_morning.name}`;
        newTrip.start_time = moment(itinerary.school_morning.morning_arrival)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'return_morning') {
        newTrip.title = '🌄 MANHÃ [Volta]';
        newTrip.schools = `${itinerary.school_morning.name}`;
        newTrip.end_time = moment(itinerary.school_morning.morning_departure)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'going_afternoon_return_morning') {
        newTrip.title = '🌄 MANHÃ [Volta] -> ⛅ TARDE [Ida]';
        newTrip.schools = `${itinerary.school_morning.name} -> ${itinerary.school_afternoon.name}`;
        newTrip.start_time = moment(
          itinerary.school_afternoon.afternoon_arrival,
        )
          .tz('America/Sao_Paulo')
          .format('HH:mm');
        newTrip.end_time = moment(itinerary.school_morning.morning_departure)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'going_afternoon') {
        newTrip.title = '⛅ TARDE [Ida]';
        newTrip.schools = `${itinerary.school_afternoon.name}`;
        newTrip.start_time = moment(
          itinerary.school_afternoon.afternoon_arrival,
        )
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'return_afternoon') {
        newTrip.title = '⛅ TARDE [Volta]';
        newTrip.schools = `${itinerary.school_afternoon.name}`;
        newTrip.end_time = moment(
          itinerary.school_afternoon.afternoon_departure,
        )
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'going_night_return_afternoon') {
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
      } else if (trip.type === 'going_night') {
        newTrip.title = '🌃 NOITE [Ida]';
        newTrip.schools = `${itinerary.school_night.name}`;
        newTrip.start_time = moment(itinerary.school_night.night_arrival)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'return_night') {
        newTrip.title = '🌃 Noite [Volta]';
        newTrip.schools = `${itinerary.school_night.name}`;
        newTrip.end_time = moment(itinerary.school_night.night_departure)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      }

      // Começo da corrida
      if (trip.started_at === null) {
        const start = {
          order: 0,
          title: '• Partida',
          type: '',
          location:
            trip.type === 'going_morning'
              ? `${itinerary.school_morning.default_location.name}`
              : trip.type === 'return_morning'
              ? `${itinerary.school_morning.address.name}`
              : trip.type === 'going_afternoon_return_morning'
              ? `${itinerary.school_morning.address.name}`
              : trip.type === 'going_afternoon'
              ? `${itinerary.school_afternoon.default_location.name}`
              : trip.type === 'return_afternoon'
              ? `${itinerary.school_afternoon.address.name}`
              : trip.type === 'going_night_return_afternoon'
              ? `${itinerary.school_afternoon.address.name}`
              : trip.type === 'going_night'
              ? `${itinerary.school_night.default_location.name}`
              : trip.type === 'return_night'
              ? `${itinerary.school_night.address.name}`
              : '',
          time:
            trip.started_at !== null
              ? moment(trip.started_at).tz('America/Sao_Paulo').format('HH:mm')
              : '',
        };

        newTrip.events.push(start);
      }

      // Waypoints intermediarios
      for (let i = 0; i < trip.student_trips.length; i++) {
        const newEvent = {
          order: -1,
          title: '',
          type: '',
          location: '',
          time: '',
        };

        newEvent.type = trip.student_trips[i].type;

        if (trip.student_trips[i].absent === true) {
          if (trip.student_trips[i].type === 'going') {
            newTrip.absents.push(
              `• ${trip.student_trips[i].student.name} [Responsável: ${trip.student_trips[i].student?.responsible_absence_going?.user?.name}]`,
            );
          } else if (trip.student_trips[i].type === 'return') {
            newTrip.absents.push(
              `• ${trip.student_trips[i].student.name} [Responsável: ${trip.student_trips[i].student?.responsible_absence_return?.user?.name}]`,
            );
          }
        }

        if (trip.student_trips[i].absent === false) {
          if (trip.student_trips[i].time === null) {
            newEvent.title = `• ${trip.student_trips[i].student.name}`;
            newEvent.location = trip.student_trips[i].student.address.name;
            newEvent.order = trip.student_trips[i].order;
            newEvent.time =
              trip.student_trips[i].time !== null
                ? moment(trip.student_trips[i].time)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '';
            newTrip.events.push(newEvent);
            newEvent.type =
              trip.student_trips[i].type === 'going'
                ? ' - Embarque'
                : ' - Desembarque';
          }
        }
      }

      // Fim da corrida
      const end = {
        order: trip.student_trips.length - newTrip.absents.length + 1,
        title: '• Fim da corrida',
        type: '',
        location:
          trip.type === 'going_morning'
            ? `${itinerary.school_morning.address.name}`
            : trip.type === 'return_morning'
            ? `${itinerary.school_morning.default_location.name}`
            : trip.type === 'going_afternoon_return_morning'
            ? `${itinerary.school_afternoon.address.name}`
            : trip.type === 'going_afternoon'
            ? `${itinerary.school_afternoon.address.name}`
            : trip.type === 'return_afternoon'
            ? `${itinerary.school_afternoon.default_location.name}`
            : trip.type === 'going_night_return_afternoon'
            ? `${itinerary.school_night.address.name}`
            : trip.type === 'going_night'
            ? `${itinerary.school_night.address.name}`
            : trip.type === 'return_night'
            ? `${itinerary.school_night.default_location.name}`
            : '',
        time:
          trip.finished_at !== null
            ? moment(trip.finished_at).tz('America/Sao_Paulo').format('HH:mm')
            : '',
      };

      newTrip.events.push(end);
      newItinerary.trip = newTrip;

      result = newItinerary;

      return { error: false, travel: result };
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }
  async findTripById(user: UserFromJwt, id: string) {
    try {
      // Pega o itinerario atual
      const itinerary = await this.prismaService.itinerary.findFirst({
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
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }

      let result = {};

      const trip = await this.prismaService.trip.findFirst({
        where: {
          id,
          itinerary_id: itinerary.id,
        },
        select: {
          id: true,
          rollCall: true,
          path: true,
          duration: true,
          estimated: true,
          started_at: true,
          finished_at: true,
          type: true,
          km: true,
          student_trips: {
            where: {
              time: null,
            },
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
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
      if (trip === null) {
        return { error: false, result };
      }

      const newItinerary = {
        id: itinerary.id,
        title: moment(itinerary.day).format('DD/MM/YYYY'),
        day: itinerary.day,
        trip: {},
      };

      // Informações da Trip
      const newTrip = {
        id: trip.id,
        title: '',
        type: trip.type,
        rollCall: trip.rollCall,
        schools: '',
        started:
          trip.started_at !== null
            ? moment(trip.started_at).tz('America/Sao_Paulo').format('HH:mm')
            : '',
        finished:
          trip.finished_at !== null
            ? moment(trip.finished_at).tz('America/Sao_Paulo').format('HH:mm')
            : '',
        start_time: '',
        end_time: '',
        absents: [],
        events: [],
      };

      if (trip.type === 'going_morning') {
        newTrip.title = '🌄 MANHÃ [Ida]';
        newTrip.schools = `${itinerary.school_morning.name}`;
        newTrip.start_time = moment(itinerary.school_morning.morning_arrival)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'return_morning') {
        newTrip.title = '🌄 MANHÃ [Volta]';
        newTrip.schools = `${itinerary.school_morning.name}`;
        newTrip.end_time = moment(itinerary.school_morning.morning_departure)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'going_afternoon_return_morning') {
        newTrip.title = '🌄 MANHÃ [Volta] -> ⛅ TARDE [Ida]';
        newTrip.schools = `${itinerary.school_morning.name} -> ${itinerary.school_afternoon.name}`;
        newTrip.start_time = moment(
          itinerary.school_afternoon.afternoon_arrival,
        )
          .tz('America/Sao_Paulo')
          .format('HH:mm');
        newTrip.end_time = moment(itinerary.school_morning.morning_departure)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'going_afternoon') {
        newTrip.title = '⛅ TARDE [Ida]';
        newTrip.schools = `${itinerary.school_afternoon.name}`;
        newTrip.start_time = moment(
          itinerary.school_afternoon.afternoon_arrival,
        )
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'return_afternoon') {
        newTrip.title = '⛅ TARDE [Volta]';
        newTrip.schools = `${itinerary.school_afternoon.name}`;
        newTrip.end_time = moment(
          itinerary.school_afternoon.afternoon_departure,
        )
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'going_night_return_afternoon') {
        newTrip.title = '⛅ TARDE [Volta] -> 🌃 NOITE [Ida]';
        newTrip.schools = `${itinerary.school_afternoon.name} -> ${itinerary.school_night.name}`;
        newTrip.start_time = moment(itinerary.school_night.night_arrival)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
        newTrip.end_time = moment(
          itinerary.school_afternoon.afternoon_departure,
        ).format('HH:mm');
      } else if (trip.type === 'going_night') {
        newTrip.title = '🌃 NOITE [Ida]';
        newTrip.schools = `${itinerary.school_night.name}`;
        newTrip.start_time = moment(itinerary.school_night.night_arrival)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      } else if (trip.type === 'return_night') {
        newTrip.title = '🌃 Noite [Volta]';
        newTrip.schools = `${itinerary.school_night.name}`;
        newTrip.end_time = moment(itinerary.school_night.night_departure)
          .tz('America/Sao_Paulo')
          .format('HH:mm');
      }

      // Começo da corrida
      if (trip.started_at === null) {
        const start = {
          order: 0,
          title: '• Partida',
          type: '',
          location:
            trip.type === 'going_morning'
              ? `${itinerary.school_morning.default_location.name}`
              : trip.type === 'return_morning'
              ? `${itinerary.school_morning.address.name}`
              : trip.type === 'going_afternoon_return_morning'
              ? `${itinerary.school_morning.address.name}`
              : trip.type === 'going_afternoon'
              ? `${itinerary.school_afternoon.default_location.name}`
              : trip.type === 'return_afternoon'
              ? `${itinerary.school_afternoon.address.name}`
              : trip.type === 'going_night_return_afternoon'
              ? `${itinerary.school_afternoon.address.name}`
              : trip.type === 'going_night'
              ? `${itinerary.school_night.default_location.name}`
              : trip.type === 'return_night'
              ? `${itinerary.school_night.address.name}`
              : '',
          time:
            trip.started_at !== null
              ? moment(trip.started_at).tz('America/Sao_Paulo').format('HH:mm')
              : '',
        };

        newTrip.events.push(start);
      }

      // Waypoints intermediarios
      for (let i = 0; i < trip.student_trips.length; i++) {
        const newEvent = {
          order: -1,
          title: '',
          type: '',
          location: '',
          time: '',
        };

        newEvent.type = trip.student_trips[i].type;

        if (trip.student_trips[i].absent === true) {
          if (trip.student_trips[i].type === 'going') {
            newTrip.absents.push(
              `• ${trip.student_trips[i].student.name} [Responsável: ${trip.student_trips[i].student?.responsible_absence_going?.user?.name}]`,
            );
          } else if (trip.student_trips[i].type === 'return') {
            newTrip.absents.push(
              `• ${trip.student_trips[i].student.name} [Responsável: ${trip.student_trips[i].student?.responsible_absence_return?.user?.name}]`,
            );
          }
        }

        if (trip.student_trips[i].absent === false) {
          if (trip.student_trips[i].time === null) {
            newEvent.title = `• ${trip.student_trips[i].student.name}`;
            newEvent.location = trip.student_trips[i].student.address.name;
            newEvent.order = trip.student_trips[i].order;
            newEvent.time =
              trip.student_trips[i].time !== null
                ? moment(trip.student_trips[i].time)
                    .tz('America/Sao_Paulo')
                    .format('HH:mm')
                : '';
            newTrip.events.push(newEvent);
            newEvent.type =
              trip.student_trips[i].type === 'going'
                ? ' - Embarque'
                : ' - Desembarque';
          }
        }
      }

      // Fim da corrida
      const end = {
        order: trip.student_trips.length - newTrip.absents.length + 1,
        title: '• Fim da corrida',
        type: '',
        location:
          trip.type === 'going_morning'
            ? `${itinerary.school_morning.address.name}`
            : trip.type === 'return_morning'
            ? `${itinerary.school_morning.default_location.name}`
            : trip.type === 'going_afternoon_return_morning'
            ? `${itinerary.school_afternoon.address.name}`
            : trip.type === 'going_afternoon'
            ? `${itinerary.school_afternoon.address.name}`
            : trip.type === 'return_afternoon'
            ? `${itinerary.school_afternoon.default_location.name}`
            : trip.type === 'going_night_return_afternoon'
            ? `${itinerary.school_night.address.name}`
            : trip.type === 'going_night'
            ? `${itinerary.school_night.address.name}`
            : trip.type === 'return_night'
            ? `${itinerary.school_night.default_location.name}`
            : '',
        time:
          trip.finished_at !== null
            ? moment(trip.finished_at).tz('America/Sao_Paulo').format('HH:mm')
            : '',
      };

      newTrip.events.push(end);
      newItinerary.trip = newTrip;

      result = newItinerary;

      return { error: false, travel: result };
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }

  async findPathCurrent(user: UserFromJwt) {
    try {
      // Pega o itinerario
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
      // Se não existir itinerary sai da função
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }
      // Pegando a viagem atual.
      const trip = await this.prismaService.trip.findFirst({
        where: {
          itinerary_id: itinerary.id,
          finished_at: null,
        },
        select: {
          id: true,
          path: true,
          started_at: true,
        },
        orderBy: {
          estimated: 'asc',
        },
      });

      let result;

      if (trip === null) {
        result = '';

        return {
          error: false,
          result,
          points: { start: {}, waypoints: [], end: {} },
        };
      } else {
        result = JSON.parse(trip.path);

        // Começo corrida
        const start = {
          title: 'Início da Rota',
          started: trip.started_at !== null ? true : false,
          location: {
            lat: result.request.origin.lat,
            lng: result.request.origin.lng,
          },
        };

        // Pegando a localização dos waypoints
        const addresses = await this.prismaService.student_Trip.findMany({
          where: {
            trip_id: trip.id,
            absent: false,
            time: null,
          },
          select: {
            time: true,
            student: {
              select: {
                id: true,
                name: true,
                address: {
                  select: {
                    name: true,
                    latitude: true,
                    longitude: true,
                  },
                },
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        });

        // Fim corrida
        const end = {
          title: 'Fim da Rota',
          location: {
            lat: result.request.destination.lat,
            lng: result.request.destination.lng,
          },
        };

        const waypoints = [];

        addresses.forEach((address) => {
          const newWaypoint = {
            id: address.student.id,
            title: address.student.name,
            address: address.student.address.name,
            time: address.time,
            location: {
              lat: address.student.address.latitude,
              lng: address.student.address.longitude,
            },
          };
          waypoints.push(newWaypoint);
        });

        return {
          error: false,
          result,
          points: { start, waypoints, end },
        };
      }
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }
  async findPathById(user: UserFromJwt, id: string) {
    try {
      // Pega o itinerario
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
      // Se não existir itinerary sai da função
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }
      // Pegando a viagem atual.
      const trip = await this.prismaService.trip.findFirst({
        where: {
          id,
          itinerary_id: itinerary.id,
        },
        select: {
          id: true,
          path: true,
          started_at: true,
        },
      });

      let result;

      if (trip === null) {
        result = '';

        return {
          error: false,
          result,
          points: { start: {}, waypoints: [], end: {} },
        };
      } else {
        result = JSON.parse(trip.path);

        // Começo corrida
        const start = {
          title: 'Início da Rota',
          started: trip.started_at !== null ? true : false,
          location: {
            lat: result.request.origin.lat,
            lng: result.request.origin.lng,
          },
        };

        // Pegando a localização dos waypoints
        const addresses = await this.prismaService.student_Trip.findMany({
          where: {
            trip_id: trip.id,
            absent: false,
            time: null,
          },
          select: {
            time: true,
            student: {
              select: {
                id: true,
                name: true,
                address: {
                  select: {
                    name: true,
                    latitude: true,
                    longitude: true,
                  },
                },
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        });

        // Fim corrida
        const end = {
          title: 'Fim da Rota',
          location: {
            lat: result.request.destination.lat,
            lng: result.request.destination.lng,
          },
        };

        const waypoints = [];

        addresses.forEach((address) => {
          const newWaypoint = {
            id: address.student.id,
            title: address.student.name,
            address: address.student.address.name,
            time: address.time,
            location: {
              lat: address.student.address.latitude,
              lng: address.student.address.longitude,
            },
          };
          waypoints.push(newWaypoint);
        });

        return {
          error: false,
          result,
          points: { start, waypoints, end },
        };
      }
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }

  async startTrip(user: UserFromJwt, id: string) {
    try {
      // Verificando Driver
      const driver = await this.prismaService.driver.findFirst({
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
      if (driver === null) {
        throw new Error('no_driver');
      }
      // Verifica a Trip
      const trip = await this.prismaService.trip.findFirst({
        where: {
          id: id,
        },
        select: {
          itinerary_id: true,
          itinerary: {
            select: {
              day: true,
            },
          },
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }

      // Verificando o dia da viagem
      const day = new Date();
      day.setDate(day.getDate() + 1);
      day.setHours(0, 0, 0, 0);

      // Para iniciar viagem você deve estar no dia do itinerario
      if (trip.itinerary.day.getTime() === day.getTime()) {
        throw new Error('no_itineraryDay');
      }

      // Marca como started TRUE o itinerary
      await this.prismaService.itinerary.update({
        where: {
          id: trip.itinerary_id,
        },
        data: {
          started: true,
        },
      });
      // Marca o tempo de inicio no started_at da Trip
      await this.prismaService.trip.update({
        where: {
          id: id,
        },
        data: {
          started_at: new Date(),
        },
      });

      // Pegando informações para a notificação
      const students_trips = await this.prismaService.student_Trip.findMany({
        where: {
          trip_id: id,
          time: null,
          absent: false,
        },
        select: {
          id: true,
          type: true,
          student: {
            select: {
              id: true,
              name: true,
              user_id: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      // Criando e enviando notificações
      students_trips.forEach(async (student_trip) => {
        if (student_trip.type === 'return') {
          await this.notificationLogicService.create({
            type: 'embarked',
            student_id: student_trip.student.id,
            //user_id: '', Não sei pra quem enviar
            name: driver.user.name,
            name_student: student_trip.student.name,
          });
        }
      });

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async catchStudent(user: UserFromJwt, id: string) {
    try {
      // Verificando Driver
      const driver = await this.prismaService.driver.findFirst({
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
      if (driver === null) {
        throw new Error('no_driver');
      }
      // Verifica a Trip
      const trip = await this.prismaService.trip.findFirst({
        where: {
          id: id,
        },
        select: {
          itinerary_id: true,
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }

      // Encontra o proximo da lista aluno
      const student_trip = await this.prismaService.student_Trip.findFirst({
        where: {
          trip_id: id,
          time: null,
        },
        select: {
          id: true,
          type: true,
          student: {
            select: {
              id: true,
              name: true,
              user_id: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });
      if (student_trip === null) {
        throw new Error('no_studentTrip');
      }

      await this.prismaService.student_Trip.update({
        where: {
          id: student_trip.id,
        },
        data: {
          time: new Date(),
        },
      });

      // Criando e enviando notificações
      await this.notificationLogicService.create({
        type: student_trip.type === 'going' ? 'embarked' : 'disembarked',
        student_id: student_trip.student.id,
        //user_id: '', Não sei pra quem enviar
        name: driver.user.name,
        name_student: student_trip.student.name,
      });

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async endTrip(user: UserFromJwt, id: string) {
    try {
      // Verificando Driver
      const driver = await this.prismaService.driver.findFirst({
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
      if (driver === null) {
        throw new Error('no_driver');
      }
      // Verificando a Trip
      const trip = await this.prismaService.trip.findFirst({
        where: {
          id: id,
        },
        select: {
          itinerary_id: true,
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }
      // Marca o tempo de finalização no finished_at da Trip
      await this.prismaService.trip.update({
        where: {
          id: id,
        },
        data: {
          finished_at: new Date(),
        },
      });

      const students_trips = await this.prismaService.student_Trip.findMany({
        where: {
          trip_id: id,
          absent: false,
        },
        select: {
          id: true,
          type: true,
          absent: true,
          student: {
            select: {
              id: true,
              name: true,
              user_id: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      // Criando notificação
      students_trips.forEach(async (student_trip) => {
        if (student_trip.type === 'going') {
          await this.notificationLogicService.create({
            type: 'disembarked',
            student_id: student_trip.student.id,
            //user_id: '', Não sei pra quem enviar
            name: driver.user.name,
            name_student: student_trip.student.name,
          });
        }
      });

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

      const trips = await this.prismaService.trip.findMany({
        where: {
          itinerary_id: itinerary.id,
          finished_at: null,
        },
      });

      if (trips.length === 0) {
        await this.prismaService.student.updateMany({
          where: {
            driver_id: driver.id,
          },
          data: {
            goes: true,
            return: true,
          },
        });

        await this.itinerariesService.createAfterFinishing(user);
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async updateLocation(user: UserFromJwt, data: { lat: number; lng: number }) {
    try {
      // Verifica Driver
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
      // Verifica Itinerary
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
      // Verifica a Trip
      const trip = await this.prismaService.trip.findFirst({
        where: {
          itinerary_id: itinerary.id,
          finished_at: null,
        },
        orderBy: {
          estimated: 'asc',
        },
      });
      if (trip === null) {
        throw new Error('no_trip');
      }

      // Atualizando localização do motorista no banco
      await this.prismaService.trip.update({
        where: {
          id: trip.id,
        },
        data: {
          latitude: data.lat,
          longitude: data.lng,
        },
      });

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findStudent(user: UserFromJwt, id: string) {
    try {
      let points = null;
      let driver_location = null;

      // Verifica a Trip
      const trip = await this.prismaService.trip.findFirst({
        where: {
          finished_at: null,
          student_trips: {
            some: {
              absent: false,
              student_id: id,
            },
          },
        },
        select: {
          latitude: true,
          longitude: true,
          started_at: true,
          finished_at: true,
          path: true,
          student_trips: {
            where: {
              student_id: id,
            },
            select: {
              time: true,
              type: true,
              student: {
                select: {
                  name: true,
                  address: {
                    select: {
                      latitude: true,
                      longitude: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          estimated: 'asc',
        },
      });
      if (trip === null) {
        return {
          error: false,
          student_name: null,
          driver_location: null,
          points: { start: null, end: null },
        };
      }

      const path = JSON.parse(trip.path);

      // Viagem começou
      if (trip.started_at !== null) {
        // Student está indo para escola, já foi pego em casa pelo Driver e ainda não chegou na escola
        if (
          trip.student_trips[0].type === 'going' &&
          trip.student_trips[0].time !== null &&
          trip.finished_at === null
        ) {
          driver_location = { lat: trip.latitude, lng: trip.longitude };
          points = {
            start: {
              title: 'Início da Rota',
              location: {
                lat: trip.student_trips[0].student.address.latitude,
                lng: trip.student_trips[0].student.address.longitude,
              },
            },
            end: {
              title: 'Fim da Rota',
              location: {
                lat: path.request.destination.lat,
                lng: path.request.destination.lng,
              },
            },
          };
          // Student está voltando para casa e ainda não chegou em casa
        } else if (
          trip.student_trips[0].type === 'return' &&
          trip.student_trips[0].time === null
        ) {
          driver_location = { lat: trip.latitude, lng: trip.longitude };
          points = {
            start: {
              title: 'Início da Rota',
              location: {
                lat: path.request.origin.lat,
                lng: path.request.origin.lng,
              },
            },
            end: {
              title: 'Fim da Rota',
              location: {
                lat: trip.student_trips[0].student.address.latitude,
                lng: trip.student_trips[0].student.address.longitude,
              },
            },
          };
        }
      } else {
        // Viagem não começou
        return {
          error: false,
          student_name: trip.student_trips[0].student.name,
          driver_location: null,
          points: { start: null, end: null },
        };
      }

      return {
        error: false,
        student_name: trip.student_trips[0].student.name,
        driver_location,
        points,
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
