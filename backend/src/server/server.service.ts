import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  ChangeMemberRoleDto,
  CreateChannelOnServerDto,
  CreateServerDto,
  DeleteServerDto,
  LeaveServerDto,
  UpdateServerDto,
} from './dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ApolloError } from 'apollo-server-express';

import { MemberRole, Profile } from '@prisma/client';
import { GraphQLErrorFilter } from 'src/filters/custom-exception-filter';
import { ChannelType } from './server.type';
@Injectable()
export class ServerService {
  constructor(private readonly prisma: PrismaService) {}

  //   async createServer() {}

  async getServerByProfileIdOfMember(email: string) {
    return this.prisma.server.findMany({
      where: {
        members: {
          some: {
            profile: {
              email,
            },
          },
        },
      },
    });
  }

  async createServer(createServerDto: CreateServerDto, imageUrl: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: createServerDto.profileId },
    });
    if (!profile)
      return new BadRequestException({ profile: "'Invalid profile'" });
    return this.prisma.server.create({
      data: {
        name: createServerDto.name,
        inviteCode: uuidv4(),
        imageUrl,
        profileId: profile.id,

        channels: {
          create: [
            {
              name: 'general',

              profileId: createServerDto.profileId,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: createServerDto.profileId,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });
  }

  async getServerById(id: number, email: string) {
    // get the server where the profile id matches the profile id of the members

    // get the profile by the user id

    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');

    const server = await this.prisma.server.findUnique({
      where: {
        id: id,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        channels: true,
        profile: true,
        members: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!server) return new ApolloError('Invalid server', 'INVALID_SERVER');
    return server;
  }

  async updateServerWithNewInviteCode(serverId: number, email: string) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: serverId,
      },
    });
    console.log('SERVER', server);
    if (!server) return new BadRequestException({ server: "'Invalid server'" });
    return this.prisma.server.update({
      where: {
        id: server.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });
  }

  @UseFilters(GraphQLErrorFilter)
  async addMemberToServer(inviteCode: string, serverId: number, email: string) {
    let server;
    try {
      console.log(inviteCode, 'inviteCode');
      server = await this.prisma.server.findUniqueOrThrow({
        where: {
          inviteCode,
        },
      });
    } catch (err) {
      throw new ApolloError('Invalid server invite code');
    }
    console.log('email69', email);
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });

    if (!profile) return new ApolloError('Invalid profile');
    const member = await this.prisma.member.findFirst({
      where: {
        AND: [
          {
            profileId: profile.id,
            serverId: server.id,
          },
        ],
      },
    });
    console.log('member69', member, serverId);
    if (member) return new ApolloError('This Profile is already a member');
    return this.prisma.server.update({
      where: {
        inviteCode,
      },
      data: {
        members: {
          create: [
            {
              profileId: profile.id,
            },
          ],
        },
      },
    });
  }

  async updateServer(updateServerDto: UpdateServerDto, imageUrl: string) {
    const server = await this.prisma.server.findUnique({
      where: {
        id: updateServerDto.serverId,
      },
    });
    if (!server) return new ApolloError('Invalid server');
    return this.prisma.server.update({
      where: {
        id: server.id,
      },
      data: {
        name: updateServerDto.name,
        imageUrl,
      },
    });
  }
  async changeMemberRole(input: ChangeMemberRoleDto, email) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');
    const member = await this.prisma.member.findUniqueOrThrow({
      where: {
        id: input.memberId,
      },
    });
    if (!member) return new ApolloError('Invalid member');

    const updatedMember = await this.prisma.member.update({
      where: {
        id: member.id,
        NOT: {
          profileId: member.id,
        },
      },
      data: {
        role: MemberRole[input.role],
      },
    });
    const server = await this.prisma.server.findUnique({
      where: {
        id: member.serverId,
      },
      include: {
        members: true,
      },
    });
    if (!server) return new ApolloError('Invalid server');
    return server;
  }

  async deleteMemberFromServer(memberId: number, email) {
    let profile: Profile;
    try {
      profile = await this.prisma.profile.findUniqueOrThrow({
        where: { email },
      });
    } catch (err) {
      throw new ApolloError('Profile not found');
    }

    const member = await this.prisma.member.findUnique({
      where: {
        id: memberId,
      },
    });
    if (!member) return new ApolloError('Invalid member');
    if (!profile) return new ApolloError('Invalid profile');
    const deletedMember = await this.prisma.member.delete({
      where: {
        id: member.id,
        NOT: {
          profileId: profile.id,
        },
      },
    });
    const server = await this.prisma.server.findUnique({
      where: {
        id: member.serverId,
      },
      include: {
        members: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!server) return new ApolloError('Invalid server');
    return server;
  }

  async createChannelOnServer(input: CreateChannelOnServerDto, email: string) {
    // only allow members with a specific profileId and role of either admin or moderator to create a channel
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });

    return this.prisma.server.update({
      where: {
        id: input.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            name: input.name,
            profileId: profile.id,
            type: ChannelType[input.type],
          },
        },
      },
    });
  }

  async deleteServer(input: DeleteServerDto, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');
    const server = await this.prisma.server.findUnique({
      where: {
        id: input.serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN],
            },
          },
        },
      },
    });
    if (!server) return new ApolloError('Invalid server');
    return this.prisma.server.delete({
      where: {
        id: server.id,
      },
    });
  }

  async leaveServer(input: LeaveServerDto, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');
    return this.prisma.server.update({
      where: {
        id: input.serverId,
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });
  }
  async deleteChannelFromServer(channelId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        profileId: profile.id,
        NOT: {
          name: 'general',
        },
      },
    });
    if (!channel) return new ApolloError('Invalid channel');
    await this.prisma.channel.delete({
      where: {
        id: channel.id,
      },
    });
    return 'Channel deleted successfully';
  }

  async updateChannel(
    channelId: number,
    name: string,
    type: ChannelType,
    email: string,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        profileId: profile.id,
        NOT: {
          name: 'general',
        },
      },
    });
    if (!channel) return new ApolloError('Invalid channel');
    return await this.prisma.channel.update({
      where: {
        id: channel.id,
      },
      data: {
        name,
        type,
      },
    });
  }

  async getChannelById(channelId: number, serverId: number, email: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { email },
    });
    if (!profile) return new ApolloError('Invalid profile');
    console.log('channelId6969', channelId, 'profile.id', profile.id);
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: channelId,
        serverId,
      },
      include: {
        messages: true,
        profile: true,
      },
    });
    if (!channel) return new ApolloError('Invalid channel');
    return channel;
  }
}
