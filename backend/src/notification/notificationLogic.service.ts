import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import WebPush from 'web-push';

type createNotification = {
  type: string;
  student_id: string;
  user_id?: string;
  name: string;
  name_student: string;
};

type typeSend = {
  id: string;
  text: string;
};

@Injectable()
export class NotificationLogicService {
  constructor(private prismaService: PrismaService) {}

  async create(data: createNotification) {
    try {
      // Enviar para Driver (Sabe pra quem enviar)
      if (data.user_id) {
        // Criando notificação no banco de dados
        const notification = await this.prismaService.notification.create({
          data: {
            type: data.type,
            name: data.name,
            student: {
              connect: {
                id: data.student_id,
              },
            },
            user: {
              connect: {
                id: data.user_id,
              },
            },
          },
        });
        if (notification === null) {
          throw new Error('driver_noticationCreated');
        }

        let text = '';

        if (data.type === 'going_true' || data.type === 'return_true') {
          text =
            data.type === 'going_true'
              ? `Estudante ${data.name_student} marcado como PRESENTE na IDA por ${data.name}`
              : `Estudante ${data.name_student} marcado como PRESENTE na VOLTA por ${data.name}`;
        } else if (
          data.type === 'going_false' ||
          data.type === 'return_false'
        ) {
          text =
            data.type === 'going_false'
              ? `Estudante ${data.name_student} marcado como AUSENTE na IDA por ${data.name}`
              : `Estudante ${data.name_student} marcado como AUSENTE na VOLTA por ${data.name}`;
        }
        // Enviando notificação
        await this.send({
          id: data.user_id,
          text,
        });

        // Student e Responsible (Não sabe quem são os Responsibles e se o Student está registrado | data.user_id = null)
      } else {
        // Encontrando Student
        const student = await this.prismaService.student.findFirst({
          where: {
            id: data.student_id,
          },
          select: {
            user_id: true,
            registered: true,
          },
        });
        if (student === null) {
          throw new Error('no_student');
        }

        let text = '';

        if (data.type === 'embarked') {
          text = `Estudante ${data.name_student} embarcou no transporte do motorista ${data.name}`;
        } else if (data.type === 'disembarked') {
          text = `Estudante ${data.name_student} desembarcou do transporte do motorista ${data.name}`;
        }

        // Gerando notificações para Students registrados
        if (student.registered) {
          await this.prismaService.notification.create({
            data: {
              type: data.type,
              name: data.name,
              student: {
                connect: {
                  id: data.student_id,
                },
              },
              user: {
                connect: {
                  id: student.user_id,
                },
              },
            },
          });

          // Enviando notificação
          await this.send({
            id: student.user_id,
            text,
          });
        }

        // Encontra os responsibles
        const responsibles = await this.prismaService.responsible.findMany({
          where: {
            registered: true,
            students: {
              some: {
                id: data.student_id,
              },
            },
          },
        });

        // Criando e enviando notificações
        responsibles.forEach(async (responsible) => {
          await this.prismaService.notification.create({
            data: {
              type: data.type,
              name: data.name,
              student: {
                connect: {
                  id: data.student_id,
                },
              },
              user: {
                connect: {
                  id: responsible.user_id,
                },
              },
            },
          });

          await this.send({
            id: responsible.user_id,
            text,
          });
        });
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async send(data: typeSend) {
    try {
      // Encontrando os subscriptions
      const subscriptions =
        await this.prismaService.notification_Subscription.findMany({
          where: {
            user_id: data.id,
          },
        });

      // Enviando para os subscriptions
      for (let i = 0; i < subscriptions.length; i++) {
        await WebPush.sendNotification(
          JSON.parse(JSON.stringify(subscriptions[i].subscription)),
          data.text,
        );
      }

      return { error: false };
    } catch (error) {
      console.log(error);
      return { error: true, message: error };
    }
  }
}
