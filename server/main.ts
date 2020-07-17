import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.NEST_PORT);
}

bootstrap();
