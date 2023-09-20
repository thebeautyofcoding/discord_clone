import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

import { ProfileModule } from './profile/profile.module';
import { ServerModule } from './server/server.module';
import { MemberModule } from './member/member.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token/token.service';
import { ChatModule } from './chat/chat.module';
import { redisPubSubProvider } from './redis-pubsub.provider';
import { LivekitModule } from './livekit/livekit.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule, AppModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,

        tokenService: TokenService,
      ) => {
        return {
          installSubscriptionHandlers: true,
          playground: true,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          sortSchema: true,
          subscriptions: {
            'graphql-ws': true,
            'subscriptions-transport-ws': true,
          },
          onConnect: (connectionParams) => {
            const token = tokenService.extractToken(connectionParams);

            if (!token) {
              throw new Error('Token not provided');
            }
            const profile = tokenService.validateToken(token);
            if (!profile) {
              throw new Error('Invalid token');
            }
            return { profile };
          },
          context: ({ req, res, connection }) => {
            if (connection) {
              return { req, res, profile: connection.context.profile }; // Injecting pubSub into context
            }
            return { req, res };
          },
        };
      },
    }),
    AuthModule,

    ProfileModule,
    ServerModule,
    MemberModule,
    ChatModule,
    LivekitModule,
  ],
  controllers: [AppController],
  providers: [AppService, TokenService, ConfigService, redisPubSubProvider],
})
export class AppModule {}
