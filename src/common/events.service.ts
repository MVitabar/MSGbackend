import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface MessageEvent {
  chatId: string;
  message: any;
}

@Injectable()
export class EventsService {
  private eventEmitter = new EventEmitter();

  emitMessageSent(chatId: string, message: any) {
    console.log('📡 Emitting newMessage to chat participants:', chatId);
    this.eventEmitter.emit('message.sent', { chatId, message });
    console.log('✅ newMessage event emitted to chat:', chatId);
  }

  getEventEmitter() {
    return this.eventEmitter;
  }
}
