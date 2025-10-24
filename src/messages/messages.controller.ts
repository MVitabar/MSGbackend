import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventsService } from '../common/events.service';
import { ChatsService } from '../chats/chats.service';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly eventsService: EventsService,
    private readonly chatsService: ChatsService,
  ) {}

  @Post()
  async createMessage(
    @Body() body: {
      content: string;
      type?: string;
      chatId: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
      replyToId?: string;
    },
    @Request() req,
  ) {
    console.log('💬 Saving message to database:', { chatId: body.chatId, content: body.content, userId: req.user.id });

    const message = await this.messagesService.createMessage(
      body.content,
      body.type || 'text',
      req.user.id,
      body.chatId,
      body.fileUrl,
      body.fileName,
      body.fileSize,
      body.replyToId,
    );

    console.log('✅ Message saved with ID:', message.id);

    // CRITICAL: Get chat participants for socket emission (como en tu ejemplo)
    const chat = await this.chatsService.getChatById(body.chatId, req.user.id);
    if (!chat) {
      throw new Error('Chat not found');
    }

    console.log('📡 Emitting newMessage to chat participants:', chat.users?.length || 0);

    // CRITICAL: Emit to ALL users in the chat (including sender)
    console.log('📡 Emitting newMessage to chat participants:', body.chatId);
    this.eventsService.emitMessageSent(body.chatId, message);
    console.log('✅ newMessage event emitted to chat:', body.chatId);

    return message;
  }

  @Get(':chatId')
  async getChatMessages(
    @Param('chatId') chatId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req,
  ) {
    return this.messagesService.getChatMessages(
      chatId,
      req.user.id,
      parseInt(page) || 1,
      parseInt(limit) || 50,
    );
  }

  @Post(':messageId/read')
  async markMessageAsRead(@Param('messageId') messageId: string) {
    return this.messagesService.markMessageAsRead(messageId, '');
  }

  @Post('chat/:chatId/read')
  async markChatMessagesAsRead(@Param('chatId') chatId: string, @Request() req) {
    return this.messagesService.markChatMessagesAsRead(chatId, req.user.id);
  }

  @Post(':messageId')
  async deleteMessage(@Param('messageId') messageId: string, @Request() req) {
    return this.messagesService.deleteMessage(messageId, req.user.id);
  }
}
