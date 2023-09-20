import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../prisma.service';
import { Profile } from '@prisma/client';
// This should contain your secret key

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    console.log('ExtractJwt', ExtractJwt.fromAuthHeaderAsBearerToken());
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'pk_test_Zml0LW1hZ3BpZS03My5jbGVyay5hY2NvdW50cy5kZXYk',
    });
  }

  async validate(payload: any): Promise<Profile> {
    console.log('user!!!', payload);
    const profile = await this.prisma.profile.findUnique({
      where: { email: payload.email },
    });

    if (!profile) {
      throw new UnauthorizedException();
    }

    return profile;
  }
}
