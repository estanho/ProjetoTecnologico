import { Module } from '@nestjs/common';
import { RollcallService } from './rollcall.service';
import { RollcallController } from './rollcall.controller';

@Module({
  controllers: [RollcallController],
  providers: [RollcallService],
})
export class RollcallModule {}
