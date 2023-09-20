import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ApolloError } from 'apollo-server-express';
import { MemberRole } from '@prisma/client';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private async createConversation(memberOneId: number, memberTwoId: number) {
    try {
      console.log('conv69', memberOneId, memberTwoId);
      return await this.prisma.conversation.create({
        data: {
          memberOneId,
          memberTwoId,
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            },
          },
          memberTwo: {
            include: {
              profile: true,
            },
          },
          directMessages: true,
        },
      });
    } catch (error) {
      console.log('error69', error);
      return null;
    }
  }

  private async findConversation(memberOneId: number, memberTwoId: number) {
    try {
      return await this.prisma.conversation.findFirst({
        where: {
          OR: [
            {
              AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
            },
            {
              AND: [{ memberOneId: memberTwoId }, { memberTwoId: memberOneId }],
            },
          ],
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            },
          },
          memberTwo: {
            include: {
              profile: true,
            },
          },
        },
      });
    } catch {
      return null;
    }
  }

  async getOrCreateConversation(memberOneId: number, memberTwoId: number) {
    const conversation = await this.findConversation(memberOneId, memberTwoId);
    console.log('conv69', memberOneId, memberTwoId, conversation);
    if (conversation) {
      return conversation;
    }

    const newConversation = await this.createConversation(
      memberOneId,
      memberTwoId,
    );
    console.log('newConv69', newConversation);
    if (!newConversation) {
      return new ApolloError('Unable to create conversation');
    }
    return newConversation;
  }

  async createMessage(
    content: string,
    currentProfileId: number,
    conversationId?: number,
    channelId?: number,
    fileUrl?: string,
  ) {
    console.log('createMessage69', conversationId, channelId);
    if (!conversationId && !channelId)
      return new ApolloError('No conversation or channel found');
    try {
      const currentProfile = await this.prisma.profile.findFirst({
        where: {
          id: currentProfileId,
        },
      });
      console.log('currentProfile69', currentProfile);
      if (!currentProfile) return new ApolloError('No profile found');
      console.log('profileId69', currentProfileId, conversationId, content);
      if (conversationId) {
        const conversation = await this.prisma.conversation.findFirst({
          where: {
            id: conversationId,
            OR: [
              {
                memberOne: {
                  profileId: currentProfileId,
                },
              },
              {
                memberTwo: {
                  profileId: currentProfileId,
                },
              },
            ],
          },
          include: {
            memberOne: {
              include: {
                profile: true,
              },
            },
            memberTwo: {
              include: {
                profile: true,
              },
            },
          },
        });
        console.log('conv69', conversation);
        if (!conversation) return new ApolloError('Conversation not found');
        const member =
          conversation.memberOne.profileId === currentProfileId
            ? conversation.memberOne
            : conversation.memberTwo;

        if (!member) return new ApolloError('Member not found');
        return await this.prisma.directMessage.create({
          data: {
            conversationId,
            memberId: member.id,
            content,
            fileUrl,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
        });
      } else if (channelId) {
        const channel = await this.prisma.channel.findFirst({
          where: {
            id: channelId,
          },
        });
        if (!channel) return new ApolloError('Channel not found');
        const member = await this.prisma.member.findFirst({
          where: {
            profileId: currentProfileId,
            serverId: channel.serverId,
          },
        });
        if (!member) return new ApolloError('Member not found');
        return await this.prisma.message.create({
          data: {
            channelId,
            memberId: member.id,
            content,
            fileUrl,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            channel: true,
          },
        });
      }
    } catch (error) {
      console.log('error69', error);
      return null;
    }
  }

  async getMessagesByConversationIdOrChannelId(
    conversationId: number,
    channelId: number,
  ) {
    if (!channelId && !conversationId)
      return new Error('Channel or conversation not found');
    if (conversationId) {
      const conversation = await this.prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
      });
      if (!conversation) return new Error('Conversation not found');
      try {
        const directMessages = await this.prisma.directMessage.findMany({
          where: {
            conversationId,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'asc',
          },
        });
        return { messages: directMessages };
      } catch (error) {
        console.log('error69', error);
        return [];
      }
    } else if (channelId) {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) return new Error('Channel not found');
      try {
        const messages = await this.prisma.message.findMany({
          where: {
            channelId,
          },
          include: {
            member: {
              include: {
                profile: true,
              },
            },
            channel: true,
          },
          orderBy: {
            updatedAt: 'asc',
          },
        });
        console.log('messages69', messages);
        return { messages };
      } catch (error) {
        console.log('error69', error);
        return [];
      }
    }
  }

  async deleteMessage(
    conversationId: number,
    channelId: number,
    messageId: number,
    profileId: number,
  ) {
    if (conversationId) {
      const conversation = await this.prisma.conversation.findFirst({
        where: {
          id: conversationId,
          OR: [
            {
              memberOne: {
                profileId: profileId,
              },
            },
            {
              memberTwo: {
                profileId: profileId,
              },
            },
          ],
        },
        include: {
          memberOne: {
            include: {
              profile: true,
            },
          },
          memberTwo: {
            include: {
              profile: true,
            },
          },
        },
      });
      if (!conversation) return new ApolloError('Conversation not found');

      const member =
        conversation.memberOne.profileId === profileId
          ? conversation.memberOne
          : conversation.memberTwo;

      if (!member) return new ApolloError('Member not found');

      const directMessage = await this.prisma.directMessage.findFirst({
        where: {
          id: messageId,
          conversationId: conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      if (!directMessage || directMessage.deleted)
        return new ApolloError('Message not found');
      this.deleteImageFile(directMessage.fileUrl);
      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator = member.role === MemberRole.MODERATOR;
      const isMessageOwner = directMessage.memberId === member.id;
      const canModify = isMessageOwner || isAdmin || isModerator;

      if (!canModify) return new ApolloError('You cannot delete this message');

      const updatedDirectMessage = await this.prisma.directMessage.update({
        where: {
          id: messageId,
        },
        data: {
          deleted: true,
          content: 'This message has been deleted',
          fileUrl: null,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      return { message: updatedDirectMessage };
    } else if (channelId) {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
        },
      });
      if (!channel) return new ApolloError('Channel not found');

      const member = await this.prisma.member.findFirst({
        where: {
          profileId: profileId,
          serverId: channel.serverId,
        },
      });
      if (!member) return new ApolloError('Member not found');

      const message = await this.prisma.message.findFirst({
        where: {
          id: messageId,
          channelId: channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      if (!message || message.deleted)
        return new ApolloError('Message not found');

      const isAdmin = member.role === MemberRole.ADMIN;
      const isModerator = member.role === MemberRole.MODERATOR;
      const isMessageOwner = message.memberId === member.id;
      const canModify = isMessageOwner || isAdmin || isModerator;

      if (!canModify) return new ApolloError('You cannot delete this message');

      const updatedMessage = await this.prisma.message.update({
        where: {
          id: messageId,
        },
        data: {
          deleted: true,
          content: 'This message has been deleted',
          fileUrl: null,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      return { message: updatedMessage };
    }
  }
  async updateMessage(
    messageId: number,
    memberId: number,
    content: string,
    channelId: number,
    conversationId: number,
  ) {
    if (!channelId && !conversationId)
      return new ApolloError('Channel or conversation not found');
    if (conversationId) {
      const directMessage = await this.prisma.directMessage.findFirst({
        where: {
          id: messageId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      if (!directMessage || directMessage.deleted) {
        return new ApolloError('Message not found');
      }

      const isMessageOwner = directMessage.memberId === memberId;
      if (!isMessageOwner)
        return new ApolloError('You cannot update this message');
      return await this.prisma.directMessage.update({
        where: {
          id: messageId,
          conversationId,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (channelId) {
      const message = await this.prisma.message.findFirst({
        where: {
          id: messageId,
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      if (!message || message.deleted) {
        return new ApolloError('Message not found');
      }
      const isMessageOwner = message.memberId === memberId;
      if (!isMessageOwner)
        return new ApolloError('You cannot update this message');
      return await this.prisma.message.update({
        where: {
          id: messageId,
          channelId,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
  }
  async deleteImageFile(fileUrl: string) {
    if (!fileUrl) return;
    const dirPath = join(process.cwd(), 'public', 'images');
    const filename = fileUrl.split('/').pop();
    const imagePath = join(dirPath, filename);
    // check if file exists before deleting
    if (existsSync(imagePath)) {
      try {
        unlinkSync(imagePath);
      } catch (err) {
        throw new Error('Error deleting image file');
      }
    }
  }

  async createChannelMessage(
    profileId: number,
    channelId: number,
    content: string,
    fileUrl?: string,
    serverId?: number,
  ) {
    try {
      const channel = await this.prisma.channel.findFirst({
        where: {
          id: channelId,
          serverId: serverId,
        },
      });
      if (!channel) return new ApolloError('Channel not found');
      const member = await this.prisma.member.findFirst({
        where: {
          profileId: profileId,
          serverId: serverId,
        },
      });
      if (!member) return new ApolloError('Member not found');
      return await this.prisma.message.create({
        data: {
          channelId,
          memberId: member.id,
          content,
          fileUrl,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } catch (error) {
      console.log('error69', error);
      return null;
    }
  }

  async getMessagesByChannelId(channelId: number) {
    try {
      const channel = await this.prisma.channel.findUnique({
        where: {
          id: channelId,
        },
      });
      if (!channel) return new Error('Channel not found');

      return await this.prisma.message.findMany({
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'asc',
        },
      });
    } catch (error) {
      console.log('error69', error);
      return [];
    }
  }
}
