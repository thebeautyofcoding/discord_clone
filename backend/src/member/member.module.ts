import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  providers: [
    MemberResolver,
    MemberService,
    PrismaService,
    JwtService,
    ConfigService,
    ProfileService,
  ],
})
export class MemberModule {}
