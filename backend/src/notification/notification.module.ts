import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationLogicService } from './notificationLogic.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationLogicService],
  exports: [NotificationLogicService],
})
export class NotificationModule {}
