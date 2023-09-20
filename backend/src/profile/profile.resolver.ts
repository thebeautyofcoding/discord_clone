import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProfileService } from './profile.service';
import { Prisma } from '@prisma/client';
import { Profile } from './profile.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProfileDto } from './dto';
import { Request } from 'express';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Profile)
  async createProfile(
    @Args('input') input: CreateProfileDto,

    @Context() ctx: { req: Request },
  ) {
    return this.profileService.createProfile(input);
  }
  @Query(() => Profile)
  async getProfileById(@Args('profileId') profileId: number) {
    return this.profileService.getProfileById(profileId);
  }

  private async storeImageAndGetUrl(file: GraphQLUpload) {
    const { createReadStream, filename } = await file;
    const uniqueFilename = `${uuidv4()}_${filename}`;
    const imagePath = join(process.cwd(), 'public', 'images', uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/images/${uniqueFilename}`;
    const readStream = createReadStream();
    readStream.pipe(createWriteStream(imagePath));
    return imageUrl;
  }
}
