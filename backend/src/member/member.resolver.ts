import { Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';

import { Member } from './member.type';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/jwt-auth.guard';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}
  @UseGuards(GraphqlAuthGuard)
  @Query(() => Member)
  async getMemberById(
    @Args('memberId') memberId: number,
    @Args('serverId') serverId: number,
  ) {
    return this.memberService.getMemberById(memberId, serverId);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Member)
  async getMemberByProfileId(
    @Args('profileId') profileId: number,
    @Args('serverId') serverId: number,
  ) {
    return this.memberService.getMemberByProfileId(profileId, serverId);
  }
}
