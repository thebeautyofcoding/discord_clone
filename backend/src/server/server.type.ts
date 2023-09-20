import { ObjectType, Field } from '@nestjs/graphql';

import { Member } from 'src/member/member.type';
import { Profile } from 'src/profile/profile.entity';
import { registerEnumType } from '@nestjs/graphql';
import { profile } from 'console';
@ObjectType()
export class Channel {
  // refers to the channel entity in the prisma schema
  @Field()
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field(() => ChannelType)
  type: ChannelType;

  @Field(() => Date, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @Field(() => [Member], { nullable: true })
  members: Member[];
}

export enum ChannelType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
}

registerEnumType(ChannelType, {
  name: 'ChannelType',
  description: 'Defines the type of channel',
});

@ObjectType()
export class Server {
  //refers to the server entity in the prisma schema
  @Field()
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field({ nullable: true })
  inviteCode: string;

  @Field(() => Profile)
  profile: Profile;

  @Field({ nullable: true })
  profileId: number;

  @Field(() => [Member], { nullable: true })
  members: Member[];

  @Field(() => [Channel], { nullable: true })
  channels: Channel[];
}
