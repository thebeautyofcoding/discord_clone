import { Module } from '@nestjs/common';
import { ServerResolver } from './server.resolver';
import { ServerService } from './server.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  providers: [
    ServerResolver,
    ServerService,
    PrismaService,
    JwtService,
    ConfigService,
    ProfileService,
  ],
})
export class ServerModule {}
