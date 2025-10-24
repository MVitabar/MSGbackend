import { Module } from '@nestjs/common';
import { PhoneUtils } from './phone.utils';
import { EventsService } from './events.service';
import { WebSocketEmitterService } from './websocket-emitter.service';

@Module({
  providers: [PhoneUtils, EventsService, WebSocketEmitterService],
  exports: [PhoneUtils, EventsService, WebSocketEmitterService],
})
export class CommonModule {}
