import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { DirectionsService } from '../../maps/directions/directions.service';
import { TripTimeService } from './tripsTime.service';

@Injectable()
export class TripGenerateService {
  constructor(
    private prismaService: PrismaService,
    private directionsService: DirectionsService,
    private tripsTimeService: TripTimeService,
  ) {}

  async intervalTrip(return_time: any, going_time: any) {
    try {
      // Consulta para a API do Google Maps (Ultimo Waypoint da Volta -> Primerio Waypoint da Ida) =  Estudantes
      const { routes, status } =
        await this.directionsService.getIntervalDirections(
          return_time.ordainedStudentsAll[
            return_time.ordainedStudentsAll.length - 1
          ].address.place_id,
          going_time.ordainedStudentsAll[0].address.place_id,
        );
      // Se o status da consulta vier com erro, sai da função
      if (status !== 'OK') {
        throw new Error('Erro na Consulta');
      }
      // Verifica tempo
      const times = await this.tripsTimeService.checkIntervalTime(
        routes,
        return_time,
      );

      return {
        error: false,
        times,
      };
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async generateTrip(user_id: string, shift: string, type: string) {
    try {
      let schoolWhere: any;
      // Verifica qual turno para realizar a pesquisa de School
      if (shift === 'morning') {
        schoolWhere = {
          status: true,
          morning: true,
          driver: {
            user: {
              id: user_id,
            },
          },
        };
      } else if (shift === 'afternoon') {
        schoolWhere = {
          status: true,
          afternoon: true,
          driver: {
            user: {
              id: user_id,
            },
          },
        };
      } else {
        schoolWhere = {
          status: true,
          night: true,
          driver: {
            user: {
              id: user_id,
            },
          },
        };
      }
      // Pesquisa de School
      const school = await this.prismaService.school.findFirst({
        where: schoolWhere,
        select: {
          id: true,
          name: true,
          morning_arrival: shift === 'morning' ? true : false,
          morning_departure: shift === 'morning' ? true : false,
          afternoon_arrival: shift === 'afternoon' ? true : false,
          afternoon_departure: shift === 'afternoon' ? true : false,
          night_arrival: shift === 'night' ? true : false,
          night_departure: shift === 'night' ? true : false,
          address: {
            select: {
              id: true,
              place_id: true,
              name: true,
              latitude: true,
              longitude: true,
            },
          },
          default_location: {
            select: {
              id: true,
              place_id: true,
              name: true,
              latitude: true,
              longitude: true,
            },
          },
        },
      });
      // Se não tiver escola, sai da função
      if (school === null) {
        throw new Error('Não possui Escola.');
      }

      let studentWhere: any;
      // Verifica o turno para criar o filtro de Student
      if (shift === 'morning') {
        studentWhere = {
          morning: true,
          school: {
            id: school.id,
            status: true,
            morning: true,
          },
          driver: {
            user: {
              id: user_id,
            },
          },
        };
      } else if (shift === 'afternoon') {
        studentWhere = {
          afternoon: true,
          school: {
            id: school.id,
            status: true,
            afternoon: true,
          },
          driver: {
            user: {
              id: user_id,
            },
          },
        };
      } else {
        studentWhere = {
          night: true,
          school: {
            id: school.id,
            status: true,
            night: true,
          },
          driver: {
            user: {
              id: user_id,
            },
          },
        };
      }
      // Pesquisa de Students
      const students = await this.prismaService.student.findMany({
        where: studentWhere,
        select: {
          id: true,
          name: true,
          goes: true,
          return: true,
          morning: shift === 'morning' ? true : false,
          afternoon: shift === 'afternoon' ? true : false,
          night: shift === 'night' ? true : false,
          school_id: true,
          address: {
            select: {
              id: true,
              place_id: true,
              name: true,
              latitude: true,
              longitude: true,
            },
          },
        },
        orderBy: [{ school: { name: 'asc' } }, { name: 'asc' }],
      });
      // Se não tiver Students, sai da função
      if (students.length === 0) {
        throw new Error('Não possui Estudantes.');
      }

      const studentsAbsent = []; // Array com students que estão faltando
      const waypointsInitial = []; // Array com os waypoints iniciais (lat e lng)
      const waypointsAll = []; // Array com todos waypoints (lat e lng)
      const studentsPresent = []; // Array com os students que vão nesse turno
      const ordainedStudents = []; // Array com os students organizados em ordem
      const ordainedStudentsAll = []; // Array com todos os students organizados em ordem

      // Verifica o tipo de viagem (Ida ou Volta)
      if (type === 'going') {
        // Padrão
        for (let i = 0; i < students.length; i++) {
          if (students[i].goes === true) {
            const waypoint = {
              lat: students[i].address.latitude,
              lng: students[i].address.longitude,
            };
            studentsPresent.push(students[i]);
            waypointsInitial.push(waypoint);
          } else {
            studentsAbsent.push(students[i]);
          }
        }
        // Consulta na API do Google (Default Location -> School Address)
        const {
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
          status,
        } = await this.directionsService.getDirections(
          school.default_location.place_id,
          school.address.place_id,
          waypointsInitial,
        );
        // Se o status da consulta vier com erro, sai da função
        if (status !== 'OK') {
          throw new Error('Erro na Consulta');
        }
        // Checa o tempo de viagem
        const times = await this.tripsTimeService.checkTime(
          shift,
          type,
          routes,
          school,
          studentsPresent.length,
        );
        // Ordena os students após consulta
        for (let i = 0; i < studentsPresent.length; i++) {
          ordainedStudents.push(studentsPresent[routes[0].waypoint_order[i]]);
        }

        // All
        for (let i = 0; i < students.length; i++) {
          const waypoint = {
            lat: students[i].address.latitude,
            lng: students[i].address.longitude,
          };
          waypointsAll.push(waypoint);
        }
        // Consulta na API do Google (Default Location -> School Address)
        const { routes: routesAll, status: statusAll } =
          await this.directionsService.getDirections(
            school.default_location.place_id,
            school.address.place_id,
            waypointsAll,
          );
        // Se o status da consulta vier com erro, sai da função
        if (statusAll !== 'OK') {
          throw new Error('Erro na Consulta');
        }
        // Checa o tempo de viagem com todos os alunos
        const timesAll = await this.tripsTimeService.checkTime(
          shift,
          type,
          routesAll,
          school,
          students.length,
        );
        // Ordena todos students após consulta
        for (let i = 0; i < students.length; i++) {
          ordainedStudentsAll.push(students[routesAll[0].waypoint_order[i]]);
        }
        //
        for (let i = 0; i < ordainedStudents.length; i++) {
          ordainedStudents[i].type = 'going';
        }
        for (let i = 0; i < studentsAbsent.length; i++) {
          studentsAbsent[i].type = 'going';
        }

        return {
          error: false,
          studentsAbsent,
          ordainedStudents,
          ordainedStudentsAll,
          times,
          timesAll,
          directions: {
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
            status,
          },
          school,
          students_length: students.length,
        };
      } else if (type === 'return') {
        // Padrão
        for (let i = 0; i < students.length; i++) {
          if (students[i].return === true) {
            const waypoint = {
              lat: students[i].address.latitude,
              lng: students[i].address.longitude,
            };
            waypointsInitial.push(waypoint);
            studentsPresent.push(students[i]);
          } else {
            studentsAbsent.push(students[i]);
          }
        }
        // Consulta na API do Google (School Address -> Default Location)
        const {
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
          status,
        } = await this.directionsService.getDirections(
          school.address.place_id,
          school.default_location.place_id,
          waypointsInitial,
        );
        // Se o status da consulta vier com erro, sai da função
        if (status !== 'OK') {
          throw new Error('Erro na Consulta');
        }
        // Checa o tempo de viagem
        const times = await this.tripsTimeService.checkTime(
          shift,
          type,
          routes,
          school,
          studentsPresent.length,
        );
        // Ordena os students após consulta
        for (let i = 0; i < studentsPresent.length; i++) {
          ordainedStudents.push(studentsPresent[routes[0].waypoint_order[i]]);
        }

        // All
        for (let i = 0; i < students.length; i++) {
          const waypoint = {
            lat: students[i].address.latitude,
            lng: students[i].address.longitude,
          };
          waypointsAll.push(waypoint);
        }
        // Consulta na API do Google (School Address -> Default Location)
        const { routes: routesAll, status: statusAll } =
          await this.directionsService.getDirections(
            school.address.place_id,
            school.default_location.place_id,
            waypointsAll,
          );
        // Se o status da consulta vier com erro, sai da função
        if (statusAll !== 'OK') {
          throw new Error('Erro na Consulta');
        }
        // Checa o tempo de viagem
        const timesAll = await this.tripsTimeService.checkTime(
          shift,
          type,
          routesAll,
          school,
          students.length,
        );
        // Ordena os students após consulta
        for (let i = 0; i < students.length; i++) {
          ordainedStudentsAll.push(students[routesAll[0].waypoint_order[i]]);
        }
        //
        for (let i = 0; i < ordainedStudents.length; i++) {
          ordainedStudents[i].type = 'return';
        }
        for (let i = 0; i < studentsAbsent.length; i++) {
          studentsAbsent[i].type = 'return';
        }

        return {
          error: false,
          studentsAbsent,
          ordainedStudents,
          ordainedStudentsAll,
          times,
          timesAll,
          directions: {
            available_travel_modes,
            geocoded_waypoints,
            routes,
            request,
            status,
          },
          school,
          students_length: students.length,
        };
      }
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async generateMixTrip(return_trip: any, going_trip: any, type: string) {
    try {
      for (let i = 0; i < going_trip.ordainedStudents.length; i++) {
        going_trip.ordainedStudents[i].type = 'going';
      }
      for (let i = 0; i < going_trip.studentsAbsent.length; i++) {
        going_trip.studentsAbsent[i].type = 'going';
      }
      for (let i = 0; i < return_trip.ordainedStudents.length; i++) {
        return_trip.ordainedStudents[i].type = 'return';
      }
      for (let i = 0; i < return_trip.studentsAbsent.length; i++) {
        return_trip.studentsAbsent[i].type = 'return';
      }

      // Concatena os students faltantes do retorno e ida
      const studentsAbsent = return_trip.studentsAbsent.concat(
        going_trip.studentsAbsent,
      );
      // Concatena os students presentes do retorno e ida
      const studentsPresent = return_trip.ordainedStudents.concat(
        going_trip.ordainedStudents,
      );

      const waypointsInitial = []; // Waypoints dos Alunos Presentes (Lat e Lng)
      const ordainedStudents = []; // Students presentes ordenados

      // Padrão
      for (let i = 0; i < studentsPresent.length; i++) {
        const waypoint = {
          lat: studentsPresent[i].address.latitude,
          lng: studentsPresent[i].address.longitude,
        };
        waypointsInitial.push(waypoint);
      }
      // Consulta para API do Google Maps (Ponto de Origem do Retorno -> Ponto de Destino da Ida)
      const {
        available_travel_modes,
        geocoded_waypoints,
        routes,
        request,
        status,
      } = await this.directionsService.getDirections(
        return_trip.directions.request.origin.place_id.replace('place_id:', ''),
        going_trip.directions.request.destination.place_id.replace(
          'place_id:',
          '',
        ),
        waypointsInitial,
      );
      // Se o status da consulta vier com erro, sai da função
      if (status !== 'OK') {
        throw new Error('Erro na Consulta');
      }
      // Checa o tempo de viagem
      const times = await this.tripsTimeService.checkTimeMix(
        type,
        routes,
        return_trip.school,
        studentsPresent.length,
      );
      // Ordena os students após consulta
      for (let i = 0; i < studentsPresent.length; i++) {
        ordainedStudents.push(studentsPresent[routes[0].waypoint_order[i]]);
      }

      // All
      // Concatena todos os students
      const studentsAll = studentsPresent.concat(studentsAbsent);
      const waypointsAll = []; // Todos os Students
      const ordainedStudentsAll = []; // Students presentes ordenados

      for (let i = 0; i < studentsAll.length; i++) {
        const waypoint = {
          lat: studentsAll[i].address.latitude,
          lng: studentsAll[i].address.longitude,
        };
        waypointsAll.push(waypoint);
      }
      // Consulta para API do Google Maps (Ponto de Origem do Retorno -> Ponto de Destino da Ida)
      const { routes: routesAll, status: statusAll } =
        await this.directionsService.getDirections(
          return_trip.directions.request.origin.place_id.replace(
            'place_id:',
            '',
          ),
          going_trip.directions.request.destination.place_id.replace(
            'place_id:',
            '',
          ),
          waypointsAll,
        );
      // Se o status da consulta vier com erro, sai da função
      if (statusAll !== 'OK') {
        throw new Error('Erro na Consulta');
      }
      // Checa o tempo de viagem
      const timesAll = await this.tripsTimeService.checkTimeMix(
        type,
        routesAll,
        return_trip.school,
        studentsAll.length,
      );
      // Ordena os students após consulta
      for (let i = 0; i < studentsAll.length; i++) {
        ordainedStudentsAll.push(studentsAll[routes[0].waypoint_order[i]]);
      }

      return {
        error: false,
        studentsAbsent,
        ordainedStudents,
        ordainedStudentsAll,
        times,
        timesAll,
        directions: {
          available_travel_modes,
          geocoded_waypoints,
          routes,
          request,
          status,
        },
      };
    } catch (error) {
      return { error: true, message: error };
    }
  }
}
