/*
 * Only initialize dotenv if we aren't in production.
 *
 * NOTE: This had to be hoisted to the top so that the config
 * can happen before importing the AppModule.
 */
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  require('dotenv').config();
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NEST_PORT);
};

void bootstrap();
