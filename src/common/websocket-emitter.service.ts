import { Injectable } from '@nestjs/common';

@Injectable()
export class WebSocketEmitterService {
  private io: any;

  setSocketServer(io: any) {
    this.io = io;
  }

  emitToChat(chatId: string, event: string, data: any) {
    if (this.io) {
      console.log(`📡 Emitting ${event} to chat participants:`, chatId);
      this.io.to(`chat:${chatId}`).emit(event, data);
      console.log(`✅ ${event} event emitted to chat:`, chatId);
    } else {
      console.warn('⚠️ WebSocket server not available');
    }
  }
}
