import { Module } from '@nestjs/common';
import { PhoneUtils } from './phone.utils';
import { EventsService } from './events.service';

@Module({
  providers: [PhoneUtils, EventsService],
  exports: [PhoneUtils, EventsService],
})
export class CommonModule {}
