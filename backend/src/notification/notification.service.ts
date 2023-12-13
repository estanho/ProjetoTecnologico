import { Injectable } from '@nestjs/common';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import moment from 'moment';
import 'moment-timezone';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getList(user: UserFromJwt) {
    try {
      const result = await this.prismaService.notification.findMany({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
          type: true,
          name: true,
          student: {
            select: {
              name: true,
            },
          },
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const notifications = [];

      result.forEach((notification) => {
        const newNotification = {
          id: notification.id,
          type: notification.type,
          student: notification.student.name,
          responsible: notification.name,
          time: `${moment(notification.created_at)
            .tz('America/Sao_Paulo')
            .format('HH:mm')}`,
          day: `${moment(notification.created_at).format('DD/MM/YYYY')}`,
        };

        notifications.push(newNotification);
      });

      return { error: false, notifications };
    } catch (error) {
      console.log(error);
      return { error: true, message: error.message };
    }
  }

  async register(user: UserFromJwt, data: CreateNotificationDto) {
    try {
      // Procurando registro
      const subscription =
        await this.prismaService.notification_Subscription.findFirst({
          where: {
            subscription: {
              path: ['keys', 'auth'],
              equals: data.keys.auth,
            },
          },
        });
      // Se não tiver o registro, adiciona no banco de dados
      if (subscription === null) {
        const registered =
          await this.prismaService.notification_Subscription.create({
            data: {
              subscription: data as object,
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

        if (registered === null) {
          throw new Error('no_registered');
        }
      }

      return { error: false };
    } catch (error) {
      return { error: true, message: error };
    }
  }
}
