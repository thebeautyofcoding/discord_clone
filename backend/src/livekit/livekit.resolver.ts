import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LivekitService } from './livekit.service';

@Resolver()
export class LivekitResolver {
  constructor(private readonly livekitService: LivekitService) {}

  @Mutation(() => String, {})
  async createAccessToken(
    @Args('name') name: string,
    @Args('chatId') chatId: string,
  ) {
    return await this.livekitService.createAccessToken(name, chatId);
  }
}
