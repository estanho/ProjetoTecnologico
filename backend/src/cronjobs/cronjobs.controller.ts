import { Controller, Get, Headers } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { IsPublic } from '../auth/decorators/is-public.decorator';

@Controller('cronjobs')
export class CronjobsController {
  constructor(private readonly cronjobsService: CronjobsService) {}

  @IsPublic()
  @Get()
  create(@Headers('Authorization') header) {
    if (header !== `Bearer ${process.env.CRON_SECRET}`) {
      return;
    } else {
      return this.cronjobsService.create();
    }
  }
}
