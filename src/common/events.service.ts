import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

export interface MessageEvent {
  chatId: string;
  message: any;
}

@Injectable()
export class EventsService {
  private eventEmitter = new EventEmitter();
  private io: any; // Socket.io server instance

  setSocketServer(io: any) {
    this.io = io;
  }

  emitMessageSent(chatId: string, message: any) {
    console.log('📡 Emitting newMessage to chat participants:', chatId);

    // Emit immediately via Socket.io if available
    if (this.io) {
      console.log('📡 Emitting newMessage via Socket.io to chat:', chatId);
      this.io.to(`chat:${chatId}`).emit('newMessage', message);
      console.log('✅ newMessage event emitted via Socket.io to chat:', chatId);
    } else {
      console.warn('⚠️ Socket.io server not available, falling back to EventEmitter');
      this.eventEmitter.emit('message.sent', { chatId, message });
    }

    // Also emit via EventEmitter for backward compatibility
    this.eventEmitter.emit('message.sent', { chatId, message });
    console.log('✅ newMessage event emitted to chat:', chatId);
  }

  getEventEmitter() {
    return this.eventEmitter;
  }
}
