import { Controller, Get, Post, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('direct')
  async createDirectChat(@Body() body: { userId?: string; phone?: string }, @Request() req) {
    console.log('🔍 CreateDirectChat - Request user ID:', req.user?.id);
    console.log('🔍 CreateDirectChat - Body received:', body);

    let targetUserId: string;

    if (body.userId) {
      targetUserId = body.userId;
    } else if (body.phone) {
      // Find user by phone number
      const user = await this.usersService.findByPhone(body.phone);
      if (!user) {
        throw new BadRequestException('User not found with that phone number');
      }
      targetUserId = user.id;
    } else {
      throw new BadRequestException('userId or phone is required');
    }

    console.log('🔍 CreateDirectChat - Target user ID:', targetUserId);

    if (req.user.id === targetUserId) {
      throw new BadRequestException('Cannot create chat with yourself');
    }

    return this.chatsService.createDirectChat(req.user.id, targetUserId);
  }

  @Post('group')
  async createGroupChat(
    @Body() body: { name: string; userIds: string[] },
    @Request() req,
  ) {
    return this.chatsService.createGroupChat(req.user.id, body.name, body.userIds);
  }

  @Get()
  async getUserChats(@Request() req) {
    return this.chatsService.getUserChats(req.user.id);
  }

  @Get(':id')
  async getChatById(@Param('id') id: string, @Request() req) {
    return this.chatsService.getChatById(id, req.user.id);
  }

  @Post(':id/users')
  async addUserToChat(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.chatsService.addUserToChat(id, body.userId);
  }

  @Post(':id/users/remove')
  async removeUserFromChat(@Param('id') id: string, @Body() body: { userId: string }) {
    return this.chatsService.removeUserFromChat(id, body.userId);
  }
}
