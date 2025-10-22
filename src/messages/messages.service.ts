import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async createMessage(
    content: string,
    type: string,
    senderId: string,
    chatId: string,
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    replyToId?: string,
  ) {
    const message = await this.prisma.message.create({
      data: {
        content,
        type,
        fileUrl,
        fileName,
        fileSize,
        senderId,
        chatId,
        replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    // Update chat's updatedAt
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getChatMessages(chatId: string, userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    return this.prisma.message.findMany({
      where: {
        chatId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        replyTo: {
          include: {
            sender: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });
  }

  async markMessageAsRead(messageId: string, userId: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async markChatMessagesAsRead(chatId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        chatId,
        senderId: {
          not: userId,
        },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getMessageById(messageId: string) {
    return this.prisma.message.findUnique({
      where: { id: messageId },
    });
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message || message.senderId !== userId) {
      throw new Error('Message not found or unauthorized');
    }

    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}
