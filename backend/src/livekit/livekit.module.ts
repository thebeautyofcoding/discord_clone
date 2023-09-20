import { Module } from '@nestjs/common';
import { LivekitService } from './livekit.service';
import { LivekitResolver } from './livekit.resolver';

@Module({
  providers: [LivekitService, LivekitResolver]
})
export class LivekitModule {}
