import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { TripGenerateService } from './services/tripsGenerate.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { TripCreateService } from './services/tripsCreate.service';

@Injectable()
export class TripsLogicService {
  constructor(
    private prismaService: PrismaService,
    private readonly tripGenerateService: TripGenerateService,
    private readonly tripCreateService: TripCreateService,
  ) {}

  async create(user: UserFromJwt) {
    let itinerary;

    try {
      // Itinerario mais recente
      itinerary = await this.prismaService.itinerary.findFirst({
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
      // Se não existir itinerary sai da função
      if (itinerary === null) {
        throw new Error('no_itinerary');
      }
      // Pegando as trips para excluir dps
      const trips = await this.prismaService.trip.findMany({
        where: {
          itinerary_id: itinerary.id,
        },
        select: {
          id: true,
        },
      });
      // Consulta pelo students da manhã
      const students_morning = await this.prismaService.student.findMany({
        where: {
          school_id: itinerary.school_morning_id,
          morning: true,
          school: {
            morning: true,
          },
        },
      });
      // Consulta pelo students da tarde
      const students_afternoon = await this.prismaService.student.findMany({
        where: {
          school_id: itinerary.school_afternoon_id,
          afternoon: true,
          school: {
            afternoon: true,
          },
        },
      });
      // Consulta pelo students da noite
      const students_night = await this.prismaService.student.findMany({
        where: {
          school_id: itinerary.school_night_id,
          night: true,
          school: {
            night: true,
          },
        },
      });

      // Variaveis para ajudar a verificar os turnos que estão cadastrados
      const morning =
        itinerary.school_morning_id === null
          ? false
          : itinerary.school_morning.status === false
          ? false
          : students_morning.length === 0
          ? false
          : true;
      const afternoon =
        itinerary.school_afternoon_id === null
          ? false
          : itinerary.school_afternoon.status === false
          ? false
          : students_afternoon.length === 0
          ? false
          : true;
      const night =
        itinerary.school_night_id === null
          ? false
          : itinerary.school_night.status === false
          ? false
          : students_night.length === 0
          ? false
          : true;

      // Varíaveis para salvar as possíveis Trips
      let morningGoingTrip: any = null; // Morning
      let morningReturnTrip: any = null; // Morning
      let morningAfternoonTrip: any = null; // MorningAfternoon
      let afternoonGoingTrip: any = null; // Afternoon
      let afternoonReturnTrip: any = null; // Afternoon
      let afternoonNightTrip: any = null; // AfternoonNight
      let nightGoingTrip: any = null; // Night
      let nightReturnTrip: any = null; // Night

      // Morning Going
      if (morning === true) {
        // Gerando Rota de Ida da Manhã
        const aux_morningGoingTrip =
          await this.tripGenerateService.generateTrip(
            user.id,
            'morning',
            'going',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_morningGoingTrip.error === true) {
          throw new Error('morning_going_g');
        }
        // Criando rota de Ida da Manhã
        const trip = await this.tripCreateService.createTrip(
          aux_morningGoingTrip,
          'morning',
          'going_morning',
          itinerary.id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (trip.error === true) {
          throw new Error('morning_going_c');
        }

        // Se deu tudo certo, salva na variavel
        morningGoingTrip = aux_morningGoingTrip;
      } else {
        console.log('Não existe escola ativada para manhã.');
      }

      // Morning e Afternoon ou Mesclar
      if (morning === true && afternoon === false) {
        // Gerando Rota de Volta da Manhã
        const aux_morningReturnTrip =
          await this.tripGenerateService.generateTrip(
            user.id,
            'morning',
            'return',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_morningReturnTrip.error === true) {
          throw new Error('morning_return_g');
        }
        // Criando Rota de Volta da Manhã
        const trip = await this.tripCreateService.createTrip(
          aux_morningReturnTrip,
          'morning',
          'return_morning',
          itinerary.id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (trip.error === true) {
          throw new Error('morning_return_c');
        }

        // Se deu tudo certo, salva na variavel
        morningReturnTrip = aux_morningReturnTrip;
        console.log('Não existe escola ativada para tarde.');
      } else if (morning === false && afternoon === true) {
        // Gerando Rota de Ida da Tarde
        const aux_afternoonGoingTrip =
          await this.tripGenerateService.generateTrip(
            user.id,
            'afternoon',
            'going',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_afternoonGoingTrip.error === true) {
          throw new Error('afternoon_going_g');
        }
        // Criando Rota de Ida da Tarde
        const trip = await this.tripCreateService.createTrip(
          aux_afternoonGoingTrip,
          'afternoon',
          'going_afternoon',
          itinerary.id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (trip.error === true) {
          throw new Error('afternoon_going_c');
        }

        // Se deu tudo certo, salva na variavel
        afternoonGoingTrip = aux_afternoonGoingTrip;
      } else if (morning === true && afternoon === true) {
        // Gerando rota de Volta da Manhã
        const morningReturn = await this.tripGenerateService.generateTrip(
          user.id,
          'morning',
          'return',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (morningReturn.error === true) {
          throw new Error('morning_return_g');
        }
        // Gerando rota de Ida da Tarde
        const afternoonGoing = await this.tripGenerateService.generateTrip(
          user.id,
          'afternoon',
          'going',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (afternoonGoing.error === true) {
          throw new Error('afternoon_going_g');
        }
        // Gerando rota entre fim da rota da Manhã e Começo da rota da Tarde
        const intervalTrip = await this.tripGenerateService.intervalTrip(
          morningReturn,
          afternoonGoing,
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (intervalTrip.error === true) {
          throw new Error('morning_afternoon_i');
        }
        if (
          intervalTrip.times.return_time_add > afternoonGoing.timesAll.estimated
        ) {
          console.log('Não deu tempo Normal!');
          // Gerando a rota mesclada de Manhã e Tarde
          const aux_morningAfternoonTrip =
            await this.tripGenerateService.generateMixTrip(
              morningReturn,
              afternoonGoing,
              'morning_afternoon',
            );
          // Se encontrar erro ao gerar a rota, sai da função
          if (aux_morningAfternoonTrip.error === true) {
            throw new Error('morning_afternoon_g');
          }
          // Verifica se Mesclando funcionou
          if (
            aux_morningAfternoonTrip.timesAll.estimated <
            afternoonGoing.school.afternoon_arrival
          ) {
            console.log('Deu tempo Mesclando!');
            // Criando rota de GOING_AFTERNOON_RETURN_MORNING
            const trip = await this.tripCreateService.createTrip(
              aux_morningAfternoonTrip,
              'morning_afternoon',
              'going_afternoon_return_morning',
              itinerary.id,
            );
            // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
            if (trip.error === true) {
              throw new Error('morning_afternoon_c');
            }

            // Se deu tudo certo, salva na variavel
            morningAfternoonTrip = aux_morningAfternoonTrip;
          } else {
            // Mesmo mesclando não dá tempo
            console.log('Mesmo mesclando não funcionou.');
            throw new Error('morning_afternoon_mix');
          }
        } else {
          // Da para fazer as rotas separadas
          console.log('Deu tempo Normal!');
          // Criando Rota de Volta da Manhã
          const trip_morning = await this.tripCreateService.createTrip(
            morningReturn,
            'morning',
            'return_morning',
            itinerary.id,
          );
          // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
          if (trip_morning.error === true) {
            throw new Error('morning_return_c');
          }
          // Criando Rota de Ida da Tarde
          const trip_afternoon = await this.tripCreateService.createTrip(
            afternoonGoing,
            'afternoon',
            'going_afternoon',
            itinerary.id,
          );
          // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
          if (trip_afternoon.error === true) {
            throw new Error('afternoon_going_c');
          }

          // Atribui as viagens
          morningReturnTrip = morningReturn;
          afternoonGoingTrip = afternoonGoing;
        }
      } else if (morning === false && afternoon === false) {
        console.log('Não existe escola ativada para tarde.');
      }

      // Tarde e Night ou Mesclar
      if (afternoon === true && night === false) {
        // Gerando Rota de Volta da Tarde
        const aux_afternoonReturnTrip =
          await this.tripGenerateService.generateTrip(
            user.id,
            'afternoon',
            'return',
          );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_afternoonReturnTrip.error === true) {
          throw new Error('afternoon_return_g');
        }
        // Criando Rota de Volta da Tarde
        const trip = await this.tripCreateService.createTrip(
          aux_afternoonReturnTrip,
          'afternoon',
          'return_afternoon',
          itinerary.id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (trip.error === true) {
          throw new Error('afternoon_return_c');
        }

        // Se deu tudo certo, salva na variavel
        afternoonReturnTrip = aux_afternoonReturnTrip;
        console.log('Não existe escola ativada para Noite.');
      } else if (afternoon === false && night === true) {
        // Gerando Rota de Ida da Noite
        const aux_nightGoingTrip = await this.tripGenerateService.generateTrip(
          user.id,
          'night',
          'going',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_nightGoingTrip.error === true) {
          throw new Error('night_going_g');
        }
        // Criando Rota de Ida da Noite
        const trip = await this.tripCreateService.createTrip(
          aux_nightGoingTrip,
          'night',
          'going_night',
          itinerary.id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (trip.error === true) {
          throw new Error('night_going_c');
        }

        // Se deu tudo certo, salva na variavel
        nightGoingTrip = aux_nightGoingTrip;
      } else if (afternoon === true && night === true) {
        // Gerando rota de Volta da Tarde
        const afternoonReturn = await this.tripGenerateService.generateTrip(
          user.id,
          'afternoon',
          'return',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (afternoonReturn.error === true) {
          throw new Error('afternoon_return_g');
        }
        // Gerando rota de Ida da Noite
        const nightGoing = await this.tripGenerateService.generateTrip(
          user.id,
          'night',
          'going',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (nightGoing.error === true) {
          throw new Error('night_going_g');
        }
        // Gerando rota entre fim da rota da Tarde e Começo da rota da Noite
        const intervalTrip = await this.tripGenerateService.intervalTrip(
          afternoonReturn,
          nightGoing,
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (intervalTrip.error === true) {
          throw new Error('afternoon_night_i');
        }
        // Verifica se da tempo de fazer as rotas separadas
        if (
          intervalTrip.times.return_time_add > nightGoing.timesAll.estimated
        ) {
          console.log('Não deu tempo Normal!');
          // Gerando a rota mesclada de Tarde e Noite
          const aux_afternoonNightTrip =
            await this.tripGenerateService.generateMixTrip(
              afternoonReturn,
              nightGoing,
              'afternoon_night',
            );
          // Se encontrar erro ao gerar a rota, sai da função
          if (aux_afternoonNightTrip.error === true) {
            throw new Error('afternoon_night_g');
          }
          // Verifica se Mesclando funcionou
          if (
            aux_afternoonNightTrip.timesAll.estimated <
            nightGoing.school.night_arrival
          ) {
            console.log('Deu tempo Mesclando!');
            // Criando rota de GOING_NIGHT_RETURN_AFTERNOON
            const trip = await this.tripCreateService.createTrip(
              aux_afternoonNightTrip,
              'afternoon_night',
              'going_night_return_afternoon',
              itinerary.id,
            );
            // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
            if (trip.error === true) {
              throw new Error('afternoon_night_c');
            }
            // Se deu tudo certo, salva na variavel
            afternoonNightTrip = aux_afternoonNightTrip;
          } else {
            // Mesmo mesclando não dá tempo
            console.log('Mesmo mesclando não funcionou.');
            throw new Error('afternoon_night_mix');
          }
        } else {
          // Da para fazer as rotas separadas
          console.log('Deu tempo Normal!');

          // Criando Rota de Volta da Tarde
          const trip_afternoon = await this.tripCreateService.createTrip(
            afternoonReturn,
            'afternoon',
            'return_afternoon',
            itinerary.id,
          );
          // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
          if (trip_afternoon.error === true) {
            throw new Error('afternoon_return_c');
          }
          // Criando Rota de Ida da Noite
          const trip_night = await this.tripCreateService.createTrip(
            nightGoing,
            'night',
            'going_night',
            itinerary.id,
          );
          // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
          if (trip_night.error === true) {
            throw new Error('night_going_c');
          }

          // Atribui as viagens
          afternoonReturnTrip = afternoonReturn;
          nightGoingTrip = nightGoing;
        }
      }

      // Night Return
      if (night === true) {
        // Gerando Rota de Ida da Manhã
        const aux_nightReturnTrip = await this.tripGenerateService.generateTrip(
          user.id,
          'night',
          'return',
        );
        // Se encontrar erro ao gerar a rota, sai da função
        if (aux_nightReturnTrip.error === true) {
          throw new Error('night_return_g');
        }
        // Criando rota de Volta da Tarde
        const trip = await this.tripCreateService.createTrip(
          aux_nightReturnTrip,
          'night',
          'return_night',
          itinerary.id,
        );
        // Se encontrar erro ao criar a rota e atribuir estudantes, sai da função
        if (trip.error === true) {
          throw new Error('night_return_c');
        }
        // Se deu tudo certo, salva na variavel
        nightReturnTrip = aux_nightReturnTrip;
      } else {
        console.log('Não existe escola ativada para Noite.');
      }

      if (trips.length > 0) {
        const arrayDeIds = trips.map((objeto) => objeto.id);

        await this.prismaService.trip.deleteMany({
          where: {
            id: {
              in: arrayDeIds,
            },
          },
        });
      }

      return {
        error: false,
        morningGoingTrip,
        morningReturnTrip,
        morningAfternoonTrip,
        afternoonGoingTrip,
        afternoonReturnTrip,
        afternoonNightTrip,
        nightGoingTrip,
        nightReturnTrip,
      };
    } catch (error) {
      console.log(error);
      // as trips para excluir
      const trips = await this.prismaService.trip.findMany({
        where: {
          itinerary_id: itinerary.id,
        },
        select: {
          id: true,
        },
      });
      if (trips.length > 0) {
        const arrayDeIds = trips.map((objeto) => objeto.id);
        await this.prismaService.trip.deleteMany({
          where: {
            id: {
              in: arrayDeIds,
            },
          },
        });
      }

      return { error: true, message: error.message };
    }
  }
}
