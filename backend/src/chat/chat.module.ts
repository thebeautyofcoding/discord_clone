import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/profile/profile.service';
import { redisPubSubProvider } from 'src/redis-pubsub.provider';
import { MemberService } from 'src/member/member.service';

@Module({
  providers: [
    ChatResolver,
    ChatService,
    PrismaService,
    JwtService,
    ConfigService,
    ProfileService,
    redisPubSubProvider,
    MemberService,
  ],
})
export class ChatModule {}
