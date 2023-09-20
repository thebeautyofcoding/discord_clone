import { Field, InputType } from '@nestjs/graphql';
import {
  IsAlphanumeric,
  IsIn,
  IsInt,
  IsString,
  isAlphanumeric,
  isString,
} from 'class-validator';

@InputType()
export class GetOrCreateConversationDto {
  @IsInt()
  @Field()
  memberOneId: number;

  @IsInt()
  @Field()
  memberTwoId: number;
}

@InputType()
export class CreateMessageDto {
  @Field({ nullable: true })
  conversationId?: number;

  @Field({ nullable: true })
  channelId?: number;

  @IsString()
  @Field()
  content: string;
}

@InputType()
export class CreateChannelMessageDto {
  @IsInt()
  @Field()
  channelId: number;

  @IsString()
  @Field()
  content: string;
}
