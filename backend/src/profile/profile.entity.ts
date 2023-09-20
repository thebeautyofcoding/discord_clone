import { Field, ObjectType } from '@nestjs/graphql';
import { Channel, Server } from 'src/server/server.type';

@ObjectType()
export class Profile {
  // this refers to the profile entity in the prisma schema
  @Field({ nullable: true })
  id: number;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  name: string;

  @Field(() => [Server], { nullable: true })
  servers: Server[];

  @Field({ nullable: true })
  imageUrl: string;

  @Field(() => [Channel], { nullable: true })
  channels: Channel[];
}
