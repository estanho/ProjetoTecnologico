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

@Injectable()
export class NotificationLogicService {
  constructor(private prismaService: PrismaService) {}

  async create(data: createNotification) {
    try {
      // Driver
      if (data.user_id) {
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

        let text;

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

        await this.send({
          id: data.user_id,
          text,
        });

        // Student e Responsible
      } else {
        // Encontrando Student
        const student = await this.prismaService.student.findFirst({
          select: {
            registered: true,
          },
        });

        if (student === null) {
          throw new Error('no_student');
        }
        // Só gerar notificação para student registrados
        if (student.registered) {
          await this.prismaService.notification.create({
            data: {
              type: data.type,
              student: {
                connect: {
                  id: data.student_id,
                },
              },
              user: {
                connect: {
                  id: data.student_id,
                },
              },
            },
          });
        }

        const responsibles = await this.prismaService.responsible.findMany({
          where: {
            students: {
              some: {
                id: data.student_id,
              },
            },
          },
        });

        responsibles.forEach(async (responsible) => {
          await this.prismaService.notification.create({
            data: {
              type: data.type,
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
        });
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async send(data: any) {
    try {
      const subscriptions =
        await this.prismaService.notification_Subscription.findMany({
          where: {
            user_id: data.id,
          },
        });

      for (let i = 0; i < subscriptions.length; i++) {
        await WebPush.sendNotification(
          JSON.parse(JSON.stringify(subscriptions[i].subscription)),
          data.text,
        );
      }

      return { error: false, subscriptions };
    } catch (error) {
      console.log(error);
      return { error: true, message: error };
    }
  }
}
