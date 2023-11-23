import { Body, Controller, Get, Post } from '@nestjs/common';
import WebPush from 'web-push';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { IsPublic } from '../auth/decorators/is-public.decorator';

const publicKey =
  'BHWg1x2gQWNNICnWbV3WtOua5XMHp_E69EOt6Qy8hXRSE4dZ81Iyo-cQgWQJo1TMUbq-NBTdEw8KUv8YyBBErH8';

const privateKey = 'Uhjxjalrc-H3_U-MC95-WAMX5TwBAh-c7EhzdFo3XBE';

WebPush.setVapidDetails('https://microrota.vercel.app', publicKey, privateKey);

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('public_key')
  findAll() {
    return { publicKey };
  }

  @Post('register')
  registration(
    @CurrentUser() user: UserFromJwt,
    @Body() body: CreateNotificationDto,
  ) {
    return this.notificationService.register(user, body);
  }

  @IsPublic()
  @Post('send')
  send(@Body() body: any) {
    return this.notificationService.send(body);
  }
}
