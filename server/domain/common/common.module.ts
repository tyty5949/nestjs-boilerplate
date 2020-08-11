import { Module } from '@nestjs/common';
import { Logger } from './logger';
import { ConfigModule } from '@nestjs/config';

/**
 * Provides common providers and exports for use in most types. Simply use
 * this module as an import to include them.
 */
@Module({
  imports: [ConfigModule],
  providers: [Logger],
  exports: [Logger, ConfigModule],
})
export class CommonModule {}
