import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import WebPush from 'web-push';

WebPush.setVapidDetails(
  'https://microrota.vercel.app',
  process.env.NOTIFICATION_PUBLIC_KEY,
  process.env.NOTIFICATION_PRIVATE_KEY,
);

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('list')
  list(@CurrentUser() user: UserFromJwt) {
    return this.notificationService.getList(user);
  }

  @Get('public_key')
  findAll() {
    return { error: false, publicKey: process.env.NOTIFICATION_PUBLIC_KEY };
  }

  @Post('register')
  registration(
    @CurrentUser() user: UserFromJwt,
    @Body() body: CreateNotificationDto,
  ) {
    return this.notificationService.register(user, body);
  }
}
