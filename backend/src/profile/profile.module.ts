import { Module } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    ProfileResolver,
    ProfileService,
    PrismaService,
    JwtService,
    ConfigService,
  ],
})
export class ProfileModule {}
