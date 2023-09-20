import { IsString, IsInt } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Channel } from 'diagnostics_channel';
import { ChannelType } from './server.type';
@InputType()
export class CreateServerDto {
  @IsString()
  @Field()
  name: string;

  //profileId
  @IsInt()
  @Field()
  profileId: number;
}

@InputType()
export class UpdateServerDto {
  @IsString()
  @Field()
  name: string;

  @IsInt()
  @Field()
  serverId: number;
}
@InputType()
export class ChangeMemberRoleDto {
  @IsInt()
  @Field()
  memberId: number;

  @IsString()
  @Field()
  role: string;
}

@InputType()
export class DeleteMemberDto {
  @IsInt()
  @Field()
  memberId: number;
}

@InputType()
export class CreateChannelOnServerDto {
  @IsString()
  @Field()
  name: string;

  @IsInt()
  @Field()
  serverId: number;

  @IsString()
  @Field()
  type: string;
}
@InputType()
export class DeleteServerDto {
  @IsInt()
  @Field()
  serverId: number;
}

@InputType()
export class LeaveServerDto {
  @IsInt()
  @Field()
  serverId: number;
}

@InputType()
export class DeleteChannelFromServerDto {
  @IsInt()
  @Field()
  channelId: number;
}
@InputType()
export class UpdateChannelDto {
  @IsInt()
  @Field()
  channelId: number;

  @IsString()
  @Field()
  name: string;

  @IsString()
  @Field(() => ChannelType)
  type: ChannelType;
}
@InputType()
export class FindChannelByIdDto {
  @IsInt()
  @Field()
  channelId: number;

  @IsInt()
  @Field()
  serverId: number;
}
