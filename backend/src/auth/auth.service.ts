import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async validateUser(email: string): Promise<any> {
    const profile = await this.prisma.profile.findUniqueOrThrow({
      where: { email },
    });
    if (profile) {
      return profile;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // ... More methods for register, etc.
}
