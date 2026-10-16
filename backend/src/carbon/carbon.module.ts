import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CarbonClient } from './carbon.client.js';

@Module({
  imports: [ConfigModule],
  providers: [CarbonClient],
  exports: [CarbonClient],
})
export class CarbonModule {}
