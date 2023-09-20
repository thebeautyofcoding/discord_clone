import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';
import { Profile } from 'src/profile/profile.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Profile)
  async login(@Args('email') email: string) {
    const user = await this.authService.validateUser(email);
    if (!user) {
      throw new Error('Invalid user');
    }
    return this.authService.login(user);
  }

  // ... Additional resolvers as needed
}
