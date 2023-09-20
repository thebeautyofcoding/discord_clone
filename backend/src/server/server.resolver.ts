import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ServerService } from './server.service';
import { Channel, Server } from './server.type';
import {
  CreateServerDto,
  UpdateServerDto,
  ChangeMemberRoleDto,
  DeleteMemberDto,
  CreateChannelOnServerDto,
  DeleteServerDto,
  LeaveServerDto,
  DeleteChannelFromServerDto,
  UpdateChannelDto,
  FindChannelByIdDto,
} from './dto';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
@Resolver()
export class ServerResolver {
  constructor(private readonly serverService: ServerService) {}
  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Server])
  async getServerByProfileIdOfMember(
    @Args('profileId') profileId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.serverService.getServerByProfileIdOfMember(
      ctx.req.profile.email,
    );
  }

  @Mutation(() => Server)
  async createServer(
    @Args('input') input: CreateServerDto,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload.FileUpload,
  ) {
    const imageUrl = await this.storeImageAndGetUrl(file);
    return this.serverService.createServer(input, imageUrl);
  }
  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', 'images', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }
  @UseGuards(GraphqlAuthGuard)
  @Query(() => Server)
  async getServerById(
    @Args('id') id: number,
    @Args('profileId') profileId: number,
    @Context() ctx: { req: Request },
  ) {
    console.log('ctx.req.profile.email!', ctx.req.profile);
    return this.serverService.getServerById(id, ctx.req.profile.email);
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async updateServerWithNewInviteCode(
    @Args('serverId') serverId: number,
    @Context() ctx: { req: Request },
  ) {
    console.log('ctx.req.profile.email', ctx.req.profile.email);
    return this.serverService.updateServerWithNewInviteCode(
      serverId,
      ctx.req.profile.email,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async addMemberToServer(
    @Args('inviteCode') inviteCode: string,
    @Args('serverId') serverId: number,
    @Context() ctx: { req: Request },
  ) {
    return this.serverService.addMemberToServer(
      inviteCode,
      serverId,
      ctx.req.profile.email,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async updateServer(
    @Args('input') input: UpdateServerDto,
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload.FileUpload,
  ) {
    let imageUrl = null;
    if (file) imageUrl = await this.storeImageAndGetUrl(file);
    return this.serverService.updateServer(input, imageUrl);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async changeMemberRole(
    @Args('input') input: ChangeMemberRoleDto,

    @Context() ctx: { req: Request },
  ) {
    return this.serverService.changeMemberRole(input, ctx.req.profile.email);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async deleteMemberFromServer(
    @Args('input') input: DeleteMemberDto,
    @Context() ctx: { req: Request },
  ) {
    return this.serverService.deleteMemberFromServer(
      input.memberId,
      ctx.req.profile.email,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Server)
  async createChannelOnServer(
    @Args('input') input: CreateChannelOnServerDto,
    @Context() ctx: { req: Request },
  ) {
    return this.serverService.createChannelOnServer(
      input,
      ctx.req.profile.email,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => String)
  async deleteServer(
    @Args('input') input: DeleteServerDto,
    @Context() ctx: { req: Request },
  ) {
    await this.serverService.deleteServer(input, ctx.req.profile.email);
    return 'Server deleted successfully';
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => String)
  async leaveServer(
    @Args('input') input: LeaveServerDto,
    @Context() ctx: { req: Request },
  ) {
    await this.serverService.leaveServer(input, ctx.req.profile.email);
    return 'Server left successfully';
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => String)
  async deleteChannelFromServer(
    @Args('input') input: DeleteChannelFromServerDto,
    @Context() ctx: { req: Request },
  ) {
    return await this.serverService.deleteChannelFromServer(
      input.channelId,
      ctx.req.profile.email,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Channel)
  async updateChannel(
    @Args('input') input: UpdateChannelDto,
    @Context() ctx: { req: Request },
  ) {
    return this.serverService.updateChannel(
      input.channelId,
      input.name,
      input.type,
      ctx.req.profile.email,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Channel)
  async getChannelById(
    @Args('input') input: FindChannelByIdDto,
    @Context() ctx: { req: Request },
  ) {
    return this.serverService.getChannelById(
      input.channelId,
      input.serverId,
      ctx.req.profile.email,
    );
  }
}
