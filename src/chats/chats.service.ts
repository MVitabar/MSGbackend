import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async createDirectChat(userId1: string, userId2: string) {
    console.log('🔍 Creating direct chat between:', userId1, 'and', userId2);

    // Check if users exist first
    const user1 = await this.prisma.user.findUnique({ where: { id: userId1 } });
    const user2 = await this.prisma.user.findUnique({ where: { id: userId2 } });

    if (!user1 || !user2) {
      throw new Error(`Users not found: ${!user1 ? userId1 : ''} ${!user2 ? userId2 : ''}`);
    }

    console.log('🔍 Users found:', user1.username, 'and', user2.username);

    // Check if chat already exists
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        type: 'direct',
        users: {
          every: {
            userId: {
              in: [userId1, userId2],
            },
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (existingChat) {
      console.log('🔍 Chat already exists, returning existing');
      return existingChat;
    }

    // Create chat first (without users) - with a name for direct chats
    console.log('🔍 Creating new chat with name:', user2.username);
    const chat = await this.prisma.chat.create({
      data: {
        type: 'direct',
        createdBy: userId1,
        name: `${user2.username}`, // Use the other user's username as chat name
      },
    });

    console.log('🔍 Chat created with ID:', chat.id, 'and name:', chat.name);

    // Then add users separately
    await this.prisma.chatUser.create({
      data: {
        chatId: chat.id,
        userId: userId1,
      },
    });

    await this.prisma.chatUser.create({
      data: {
        chatId: chat.id,
        userId: userId2,
      },
    });

    console.log('🔍 Users added to chat');

    // Return chat with users
    const result = await this.prisma.chat.findUnique({
      where: { id: chat.id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
      },
    });

    console.log('🔍 Final chat result name:', result?.name);
    return result;
  }

  async createGroupChat(creatorId: string, name: string, userIds: string[]) {
    const chat = await this.prisma.chat.create({
      data: {
        name,
        type: 'group',
        createdBy: creatorId,
        users: {
          create: [
            { userId: creatorId },
            ...userIds.map(userId => ({ userId })),
          ],
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return chat;
  }

  async getUserChats(userId: string) {
    // First get all chats with their messages
    const chatsWithMessages = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Transform the response to include lastMessage and lastMessageTime as separate properties
    return chatsWithMessages.map(chat => {
      const lastMessage = chat.messages.length > 0 ? chat.messages[0] : null;

      return {
        id: chat.id,
        name: chat.name,
        type: chat.type,
        description: chat.description,
        avatar: chat.avatar,
        createdBy: chat.createdBy,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        users: chat.users,
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          type: lastMessage.type,
          sender: lastMessage.sender,
          createdAt: lastMessage.createdAt,
          isRead: lastMessage.isRead,
        } : null,
        lastMessageTime: lastMessage ? lastMessage.createdAt : null,
      };
    });
  }

  async getChatById(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                status: true,
              },
            },
          },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async addUserToChat(chatId: string, userId: string) {
    return this.prisma.chatUser.create({
      data: {
        chatId,
        userId,
      },
    });
  }

  async removeUserFromChat(chatId: string, userId: string) {
    return this.prisma.chatUser.deleteMany({
      where: {
        chatId,
        userId,
      },
    });
  }
}
