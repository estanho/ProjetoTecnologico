import { Injectable } from '@nestjs/common';
import WebPush from 'web-push';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { PrismaService } from '../database/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async register(user: UserFromJwt, data: CreateNotificationDto) {
    try {
      const subscription =
        await this.prismaService.notification_Subscription.findFirst({
          where: {
            subscription: {
              path: ['keys', 'auth'],
              equals: data.keys.auth,
            },
          },
        });

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
      console.log(error);
      return { error: true, message: error };
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
          'HELLO DO BACKEND',
        );
      }

      return { error: false, subscriptions };
    } catch (error) {
      console.log(error);
      return { error: true, message: error };
    }
  }
}
