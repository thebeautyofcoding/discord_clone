import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Clerk } from '@clerk/clerk-sdk-node';
import { ProfileService } from 'src/profile/profile.service';
import { ApolloError } from 'apollo-server-express';
@Injectable()
export class GraphqlAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private profileService: ProfileService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlCtx = context.getArgByIndex(2);
    const request: Request = gqlCtx.req;
    const token = this.extractToken(request);
    console.log(token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: this.configService.get('JWT_PUBLIC_KEY'),
        algorithms: ['RS256'],
      });
      console.log('payload', payload);

      request['profile'] = payload;
      console.log('request123', request['profile']);
    } catch (err) {
      console.log('err', err.message);
      throw new ApolloError(err.message, err.code);
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    return request?.headers?.authorization?.replace('Bearer ', '');
  }
}
