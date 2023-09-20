import { ObjectType, Field } from '@nestjs/graphql';
import { registerEnumType } from '@nestjs/graphql';
import { Profile } from 'src/profile/profile.entity';
import { Server } from 'src/server/server.type';
@ObjectType()
export class Member {
  @Field({ nullable: true })
  id: number;

  @Field(() => Profile, { nullable: true })
  profile: Profile;

  @Field({ nullable: true })
  profileId: number;

  @Field(() => Server, { nullable: true })
  server: Server;

  @Field(() => MemberRole, { nullable: true })
  role: MemberRole;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  @Field({ nullable: true })
  imageUrl: string;

  @Field({ nullable: true })
  email: string;
  @Field({ nullable: true })
  name: string;
}

export enum MemberRole {
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  GUEST = 'GUEST',
}

registerEnumType(MemberRole, {
  name: 'MemberRole',
  description: 'Defines the role of a member in a server',
});
