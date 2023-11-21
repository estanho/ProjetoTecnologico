import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
import { TripsLogicService } from '../trips/tripsLogic.service';

@Injectable()
export class StudentService {
  constructor(
    private prismaService: PrismaService,
    private tripsLogicService: TripsLogicService,
  ) {}

  async create(user: UserFromJwt, createStudentDto: CreateStudentDto) {
    try {
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

      const student = await this.prismaService.student.create({
        data: {
          name: createStudentDto.name,
          address: {
            create: {
              name: createStudentDto.location.name,
              place_id: createStudentDto.location.place_id,
              latitude: createStudentDto.location.latitude,
              longitude: createStudentDto.location.longitude,
            },
          },
          morning: createStudentDto.morning,
          afternoon: createStudentDto.afternoon,
          night: createStudentDto.night,
          driver: { connect: { id: driver.id } },
          school: { connect: { id: createStudentDto.school_id } },
        },
        select: {
          id: true,
        },
      });

      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true) {
        await this.prismaService.student.delete({
          where: {
            id: student.id,
          },
        });
        return { error: true, message: trips.message };
      }

      if (createStudentDto.responsibles.length > 0) {
        for (let i = 0; i < createStudentDto.responsibles.length; i++) {
          const responsible = await this.prismaService.responsible.findFirst({
            where: {
              email: createStudentDto.responsibles[i],
            },
            select: {
              id: true,
              email: true,
              registered: true,
            },
          });

          if (responsible === null) {
            await this.prismaService.responsible.create({
              data: {
                email: createStudentDto.responsibles[i],
                students: { connect: { id: student.id } },
              },
            });
          } else {
            await this.prismaService.responsible.update({
              where: {
                email: createStudentDto.responsibles[i],
              },
              data: {
                students: { connect: { id: student.id } },
              },
            });
          }
        }
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async findAll(user: UserFromJwt) {
    try {
      // Pegando itinerario atual
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

      const data = await this.prismaService.student.findMany({
        where: {
          driver: {
            user_id: user.id,
          },
        },
        select: {
          id: true,
          name: true,
          code: true,
          registered: true,
          email: true,
          address: {
            select: {
              id: true,
              name: true,
              latitude: true,
              longitude: true,
              place_id: true,
            },
          },
          morning: true,
          afternoon: true,
          night: true,
          goes: true,
          return: true,
          school: {
            select: {
              id: true,
              name: true,
              morning: true,
              afternoon: true,
              night: true,
            },
          },
          responsibles: {
            select: {
              email: true,
              registered: true,
              user: {
                select: {
                  name: true,
                  cellphone: true,
                },
              },
            },
          },
        },
        orderBy: [{ school: { name: 'asc' } }, { name: 'asc' }],
      });

      const result = [];

      data.forEach((item) => {
        const newItem = {
          id: item.id,
          name: item.name,
          code: item.code,
          email: item.email,
          address: item.address.name,
          location: {
            id: item.address.id,
            name: item.address.name,
            latitude: item.address.latitude,
            longitude: item.address.longitude,
            place_id: item.address.place_id,
          },
          shift: '',
          goes: item.goes,
          return: item.return,
          school_name: item?.school?.name,
          school_id: item?.school?.id,
          responsibles_email: '',
          responsibles: [],
        };

        item.responsibles.forEach((item, i) => {
          const responsible = {
            name: item.registered === true ? item.user.name : '',
            cellphone: item.registered === true ? item.user.cellphone : '',
          };

          if (i === 0) {
            newItem.responsibles_email = item.email;
          } else {
            newItem.responsibles_email = newItem.responsibles_email.concat(
              ', ',
              item.email,
            );
          }

          newItem.responsibles.push(responsible);
        });

        if (item.school !== null) {
          if (item.morning === true) {
            if (item.school.morning === true) {
              newItem.shift = 'morning';
            } else {
              newItem.shift = '';
            }
          } else if (item.afternoon === true) {
            if (item.school.afternoon === true) {
              newItem.shift = 'afternoon';
            } else {
              newItem.shift = '';
            }
          } else if (item.night === true) {
            if (item.school.night === true) {
              newItem.shift = 'night';
            } else {
              newItem.shift = '';
            }
          }
        } else {
          newItem.shift = '';
        }

        result.push(newItem);
      });

      return { error: false, students: result, started: itinerary?.started };
    } catch (error) {
      return { error: true, message: error };
    }
  }

  async update(
    user: UserFromJwt,
    id: string,
    updateStudentDto: UpdateStudentDto,
  ) {
    try {
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

      const student = await this.prismaService.student.update({
        where: {
          id: id,
          driver_id: driver.id,
        },
        data: {
          name: updateStudentDto.name,
          address: {
            update: {
              name: updateStudentDto.location.name,
              place_id: updateStudentDto.location.place_id,
              latitude: updateStudentDto.location.latitude,
              longitude: updateStudentDto.location.longitude,
            },
          },
          morning: updateStudentDto.morning,
          afternoon: updateStudentDto.afternoon,
          night: updateStudentDto.night,
          school: { connect: { id: updateStudentDto.school_id } },
        },
        include: {
          responsibles: true,
        },
      });

      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true) {
        await this.prismaService.student.update({
          data: {
            school: { disconnect: { id: updateStudentDto.school_id } },
          },
          where: {
            id: student.id,
          },
        });
        return { error: true, message: trips.message };
      }

      // Array para armazenar os IDs dos responsáveis que precisam ser desconectados
      const responsiblesToDisconnect: string[] = [];

      // Se o aluno tinha responsáveis
      if (student.responsibles.length > 0) {
        // Itera sobre os responsáveis atuais do aluno
        for (const oldResponsible of student.responsibles) {
          // Verifica se o e-mail do responsável atual não está na nova lista
          if (!updateStudentDto.responsibles.includes(oldResponsible.email)) {
            // Desconecta o responsável
            responsiblesToDisconnect.push(oldResponsible.id);
          }
        }
      }

      // Conecta os novos responsáveis
      for (const newEmail of updateStudentDto.responsibles) {
        const existingResponsible =
          await this.prismaService.responsible.findFirst({
            where: {
              email: newEmail,
            },
          });

        if (!existingResponsible) {
          // Se o responsável não existe, cria um novo
          await this.prismaService.responsible.create({
            data: {
              email: newEmail,
              students: { connect: { id: student.id } },
            },
          });
        } else {
          // Se o responsável já existe, conecta
          await this.prismaService.student.update({
            where: { id: student.id },
            data: {
              responsibles: { connect: { id: existingResponsible.id } },
            },
          });
        }
      }

      // Se o aluno tinha responsáveis, desconecta os responsáveis que não estão mais na lista
      if (responsiblesToDisconnect.length > 0) {
        await this.prismaService.student.update({
          where: { id: student.id },
          data: {
            responsibles: {
              disconnect: responsiblesToDisconnect.map((id) => ({ id })),
            },
          },
        });
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async remove(user: UserFromJwt, id: string) {
    try {
      // Deletando student
      const result = await this.prismaService.student.delete({
        where: {
          id,
          driver: {
            user_id: user.id,
          },
        },
        select: {
          user_id: true,
        },
      });

      if (result.user_id !== null) {
        // Deletando usuario
        await this.prismaService.auth_users.delete({
          where: {
            id: result.user_id,
          },
        });
      }

      const trips = await this.tripsLogicService.create(user);

      if (trips.error === true) {
        return { error: true, message: trips.message };
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}
