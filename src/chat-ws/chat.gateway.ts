import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { ChatsService } from '../chats/chats.service';
import { MessagesService } from '../messages/messages.service';
import { JwtService } from '@nestjs/jwt';
import { EventsService } from '../common/events.service';
import { WebSocketEmitterService } from '../common/websocket-emitter.service';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;
  constructor(
    private chatsService: ChatsService,
    private messagesService: MessagesService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private websocketEmitter: WebSocketEmitterService,
  ) {}

  afterInit(server: Server) {
    // Configure WebSocketEmitterService with the server instance
    this.websocketEmitter.setSocketServer(server);

    // Listen for message events from REST API
    this.eventsService.getEventEmitter().on('message.sent', (data: { chatId: string, message: any }) => {
      console.log('📨 Processing message event for chat:', data.chatId);
      this.websocketEmitter.emitToChat(data.chatId, 'newMessage', data.message);
    });

    // Debug logging for all socket events
    server.on('connection', (socket: Socket) => {
      console.log(`🔗 User connected: ${socket.id}`);

      socket.onAny((eventName, data) => {
        console.log(`🔄 Socket ${eventName}:`, data);
      });
    });
  }

  private connectedUsers = new Map<string, Socket>();

  async handleConnection(socket: Socket) {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      // Extract user ID from JWT token
      const decoded = this.jwtService.verify(token.replace('Bearer ', ''));
      const userId = decoded.sub;

      if (!userId) {
        socket.disconnect();
        return;
      }

      this.connectedUsers.set(userId, socket);
      socket.join(`user:${userId}`);

      // Update user status to online
      await this.usersService.updateStatus(userId, 'online');

      // Notify all users about status change
      socket.broadcast.emit('userStatusChanged', {
        userId,
        status: 'online',
        timestamp: new Date().toISOString(),
      });

      console.log(`User ${userId} connected`);

    } catch (error) {
      console.error('WebSocket JWT verification failed:', error);
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    // Find and remove disconnected user
    for (const [userId, userSocket] of this.connectedUsers.entries()) {
      if (userSocket.id === socket.id) {
        this.connectedUsers.delete(userId);

        // Update user status to offline
        this.usersService.updateStatus(userId, 'offline');

        // Notify all users about status change
        socket.broadcast.emit('userStatusChanged', {
          userId,
          status: 'offline',
          timestamp: new Date().toISOString(),
        });

        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  @SubscribeMessage('join-chat')
  async handleJoinChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(`chat:${data.chatId}`);

    // Find user ID from connected users
    let userId: string | undefined;
    for (const [uid, userSocket] of this.connectedUsers.entries()) {
      if (userSocket.id === socket.id) {
        userId = uid;
        break;
      }
    }

    if (userId) {
      socket.join(`user:${userId}`);
    }

    console.log(`User joined chat: ${data.chatId}`);

    // Send recent messages when user joins chat
    if (userId) {
      try {
        const messages = await this.messagesService.getChatMessages(data.chatId, userId, 1, 50);

        if (messages.length > 0) {
          console.log(`📨 Sending ${messages.length} recent messages to user ${userId}`);
          socket.emit('recentMessages', { chatId: data.chatId, messages: messages.reverse() });
        }
      } catch (error) {
        console.error('Error sending recent messages:', error);
      }
    }
  }

  @SubscribeMessage('leave-chat')
  async handleLeaveChat(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`chat:${data.chatId}`);
    console.log(`User left chat: ${data.chatId}`);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() data: {
      content: string;
      type?: string;
      chatId: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    },
    @ConnectedSocket() socket: Socket,
  ) {
    // Extract user ID from the connected socket
    let userId: string | undefined;
    for (const [uid, userSocket] of this.connectedUsers.entries()) {
      if (userSocket.id === socket.id) {
        userId = uid;
        break;
      }
    }

    if (!userId) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    const message = await this.messagesService.createMessage(
      data.content,
      data.type || 'text',
      userId,
      data.chatId,
      data.fileUrl,
      data.fileName,
      data.fileSize,
    );

    // Emit message to all users in the chat (including sender)
    this.server.to(`chat:${data.chatId}`).emit('newMessage', message);

    return message;
  }

  @SubscribeMessage('mark-message-read')
  async handleMarkMessageRead(
    @MessageBody() data: { messageId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // Extract user ID from the connected socket
    let userId: string | undefined;
    for (const [uid, userSocket] of this.connectedUsers.entries()) {
      if (userSocket.id === socket.id) {
        userId = uid;
        break;
      }
    }

    if (!userId) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    console.log(`🔍 User ${userId} marking message ${data.messageId} as read`);

    try {
      // Mark message as read in database
      await this.messagesService.markMessageAsRead(data.messageId, userId);

      // Get the message to find the chatId for emitting
      const message = await this.messagesService.getMessageById(data.messageId);

      if (message) {
        // Emit to all users in the chat that the message was read
        socket.to(`chat:${message.chatId}`).emit('message-read', {
          messageId: data.messageId,
          userId: userId,
          isRead: true,
        });

        console.log(`✅ Message ${data.messageId} marked as read by user ${userId}`);
      }

      return { success: true };
    } catch (error) {
      console.error(`❌ Error marking message ${data.messageId} as read:`, error);
      socket.emit('error', { message: 'Failed to mark message as read' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('mark-chat-read')
  async handleMarkChatRead(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    // Extract user ID from the connected socket
    let userId: string | undefined;
    for (const [uid, userSocket] of this.connectedUsers.entries()) {
      if (userSocket.id === socket.id) {
        userId = uid;
        break;
      }
    }

    if (!userId) {
      socket.emit('error', { message: 'User not authenticated' });
      return;
    }

    console.log(`🔍 User ${userId} marking chat ${data.chatId} as read`);

    try {
      // Mark all messages in chat as read
      const result = await this.messagesService.markChatMessagesAsRead(data.chatId, userId);

      // Emit to all users in the chat that messages were read
      socket.to(`chat:${data.chatId}`).emit('chat-read', {
        chatId: data.chatId,
        userId: userId,
        messagesRead: result.count,
      });

      console.log(`✅ Chat ${data.chatId} marked as read by user ${userId} (${result.count} messages)`);

      return { success: true, messagesRead: result.count };
    } catch (error) {
      console.error(`❌ Error marking chat ${data.chatId} as read:`, error);
      socket.emit('error', { message: 'Failed to mark chat as read' });
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { chatId: string; isTyping: boolean },
    @ConnectedSocket() socket: Socket,
  ) {
    // Extract user ID from the connected socket
    let userId: string | undefined;
    for (const [uid, userSocket] of this.connectedUsers.entries()) {
      if (userSocket.id === socket.id) {
        userId = uid;
        break;
      }
    }

    if (!userId) {
      return;
    }

    socket.to(`chat:${data.chatId}`).emit('user-typing', {
      userId,
      isTyping: data.isTyping,
    });
  }
}
