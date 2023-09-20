import {
  Args,
  Context,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import {
  Conversation,
  DirectMessage,
  Message,
  MessageResult,
  MessagesResult,
} from './types';
import { ChatService } from './chat.service';
import {
  CreateChannelMessageDto,
  CreateMessageDto,
  GetOrCreateConversationDto,
} from './dto';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfileService } from 'src/profile/profile.service';
import { Request } from 'express';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { createWriteStream, mkdirSync, unlink, unlinkSync } from 'fs';
import { MemberService } from 'src/member/member.service';
import { ApolloError } from 'apollo-server-express';
import { GraphQLErrorFilter } from 'src/filters/custom-exception-filter';

@Resolver()
export class ChatResolver {
  constructor(
    private readonly chatService: ChatService,
    private readonly profileService: ProfileService,
    @Inject('REDIS_PUB_SUB') private pubSub: RedisPubSub,
    private readonly memberService: MemberService,
  ) {}
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Conversation, {})
  async getOrCreateConversation(
    @Args('input') input: GetOrCreateConversationDto,
  ) {
    return await this.chatService.getOrCreateConversation(
      input.memberOneId,
      input.memberTwoId,
    );
  }

  @Subscription(() => MessageResult, {
    filter: (payload, variables) => {
      console.log('var69', variables, payload);
      if (variables.conversationId) {
        return (
          payload.messageCreated.message.conversationId ===
          variables.conversationId
        );
      } else {
        return payload.messageCreated.message.channelId === variables.channelId;
      }
    },
  })
  messageCreated(
    @Args('conversationId', { nullable: true }) conversationId?: number,
    @Args('channelId', { nullable: true }) channelId?: number,
  ): AsyncIterator<DirectMessage> {
    console.log('sub69', conversationId);
    return this.pubSub.asyncIterator('messageCreated');
  }
  @UseFilters(GraphQLErrorFilter)
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MessageResult)
  async createMessage(
    @Args('input') input: CreateMessageDto,
    @Context() ctx: { req: Request },
    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload,
  ) {
    console.log('createMessage69', input);
    const profile = await this.profileService.getProfileByEmail(
      ctx.req.profile.email,
    );
    let imageUrl = '';
    if (file) {
      imageUrl = await this.storeImageAndGetUrl(file);
    }
    const message = await this.chatService.createMessage(
      input.content,
      profile.id,
      input.conversationId,
      input.channelId,
      imageUrl,
    );

    await this.pubSub.publish('messageCreated', {
      messageCreated: { message },
      conversationId: input.conversationId,
      chanelId: input.channelId,
    });
    return { message };
  }

  async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}_${filename}`;
    const dirPath = join(process.cwd(), 'public', 'images');
    const imagePath = join(dirPath, uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFilename}`;
    mkdirSync(dirPath, { recursive: true });
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));

    await new Promise((resolve, reject) => {
      readStream
        .pipe(createWriteStream(imagePath))
        .on('error', reject)
        .on('finish', resolve);
    });
    return imageUrl;
  }
  @UseGuards(GraphqlAuthGuard)
  @Query(() => MessagesResult)
  async getMessagesByConversationIdOrChannelId(
    @Args('conversationId', { nullable: true }) conversationId?: number,
    @Args('channelId', { nullable: true }) channelId?: number,
  ) {
    return this.chatService.getMessagesByConversationIdOrChannelId(
      conversationId,
      channelId,
    );
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MessageResult) // The return type might change based on what you're returning.
  async deleteMessage(
    @Args('messageId') messageId: number,
    @Context() ctx: { req: Request },
    @Args('conversationId', { nullable: true })
    conversationId?: number,
    @Args('channelId', { nullable: true }) channelId?: number,
  ) {
    if (!conversationId && !channelId) {
      throw new ApolloError(
        'Either conversationId or channelId must be provided',
      );
    }

    const profile = await this.profileService.getProfileByEmail(
      ctx.req.profile.email,
    );
    const deletedMessage = await this.chatService.deleteMessage(
      conversationId,
      channelId,
      messageId,

      profile.id,
    );

    try {
      await this.pubSub.publish('messageDeleted', {
        messageDeleted: deletedMessage,
      });
    } catch (err) {
      console.log('err69', err);
    }

    return deletedMessage;
  }

  @Subscription(() => MessageResult)
  messageDeleted(
    @Args('conversationId', { nullable: true }) conversationId?: number,
    @Args('channelId', { nullable: true }) channelId?: number,
  ): AsyncIterator<MessageResult> {
    return this.pubSub.asyncIterator('messageDeleted');
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => MessageResult)
  async updateMessage(
    @Args('messageId') messageId: number,

    @Args('content') content: string,
    @Context() ctx: { req: Request },
    @Args('conversationId', { nullable: true })
    conversationId?: number,
    @Args('channelId', { nullable: true }) channelId?: number,
  ) {
    const member = await this.memberService.getMemberByEmail(
      ctx.req.profile.email,
    );
    if (!member) return new ApolloError('Member not found');

    const updatedMessage = await this.chatService.updateMessage(
      messageId,
      member.id,
      content,
      channelId,
      conversationId,
    );
    this.pubSub.publish('messageUpdated', {
      messageUpdated: { message: updatedMessage },
    });
    return { message: updatedMessage };
  }

  @Subscription(() => MessageResult)
  messageUpdated(
    @Args('conversationId', { nullable: true }) conversationId?: number,
    @Args('channelId', { nullable: true }) channelId?: number,
  ): AsyncIterator<MessageResult> {
    return this.pubSub.asyncIterator('messageUpdated');
  }
  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Message)
  async createChannelMessage(
    @Args('input') input: CreateChannelMessageDto,

    @Args('file', { type: () => GraphQLUpload, nullable: true })
    file: GraphQLUpload,
    @Context() ctx: { req: Request },
  ) {
    const profile = await this.profileService.getProfileByEmail(
      ctx.req.profile.email,
    );
    let imageUrl = '';
    if (file) {
      imageUrl = await this.storeImageAndGetUrl(file);
    }
    const { channelId, content } = input;
    const newChannelMessage = await this.chatService.createChannelMessage(
      profile.id,
      channelId,
      content,
      imageUrl,
    );
    await this.pubSub.publish('channelMessageCreated', {
      channelMessageCreated: newChannelMessage,
      channelId: channelId,
    });
    return newChannelMessage;
  }

  @Subscription(() => MessageResult, {
    filter: (payload, variables) => {
      return payload.channelMessageCreated.channelId !== variables.channelId;
    },
  })
  channelMessageCreated(
    @Args('channelId', { nullable: true }) channelId?: number,
    @Args('conversationId', { nullable: true }) conversationId?: number,
  ): AsyncIterator<Message> {
    return this.pubSub.asyncIterator('channelMessageCreated');
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Message])
  async getMessagesByChannelId(@Args('channelId') channelId: number) {
    return this.chatService.getMessagesByChannelId(channelId);
  }
}
