import { Module } from '@nestjs/common';
import { Logger } from './logger';

/**
 * Provides common providers and exports for use in most models. Simply use
 * this module as an import to include them.
 */
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class CommonModule {}
