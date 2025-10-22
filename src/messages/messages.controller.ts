import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

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
    return this.messagesService.createMessage(
      body.content,
      body.type || 'text',
      req.user.id,
      body.chatId,
      body.fileUrl,
      body.fileName,
      body.fileSize,
      body.replyToId,
    );
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
