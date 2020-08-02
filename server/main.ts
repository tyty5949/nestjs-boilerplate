/* eslint-disable @typescript-eslint/no-unsafe-call */
/*
 * Only initialize dotenv if we aren't in production.
 *
 * NOTE: This had to be hoisted to the top so that the config
 * can happen before importing modules that depend on variables
 * from the .env file.
 */
import { INestApplication } from '@nestjs/common';

if (process.env.NODE_ENV !== 'production') {
  // dotenv doesn't have types :\
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-var-requires
  require('dotenv').config();
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { TypeormStore } from 'connect-typeorm';
import * as passport from 'passport';
import * as session from 'express-session';
import * as helmet from 'helmet';
import { Session } from './domain/auth/entities/session.entity';

const applyNestApplicationMiddleware = (app: INestApplication): void => {
  // Must come before other calls to app.use() or setup functions that may call app.use()
  // @see https://docs.nestjs.com/techniques/security#helmet
  app.use(helmet());

  // Sets up the express-session for use in nestjs
  // Session data is also persisted to the database using TypeORM
  // so that is setup here as well.
  // @see https://github.com/expressjs/session#readme
  // @see https://github.com/nykula/connect-typeorm#readme
  const sessionRepository = getRepository(Session);
  app.use(
    session({
      name: 'user_session',
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      // Session expiration is renewed and persisted on every request
      rolling: true,
      cookie: {
        httpOnly: true,
        // Session cookie is valid for 6 hours
        maxAge: 1000 * 60 * 60 * 6,
      },
      store: new TypeormStore({
        // For each new session, attempts to remove 10 expired sessions
        cleanupLimit: 10,
        // Makes a separate query for cleanup since MariaDB doesn't always support the single query syntax
        limitSubquery: false,
      }).connect(sessionRepository),
    }),
  );

  // Initialize passport for handling auth within our nestjs app
  app.use(passport.initialize());
  app.use(passport.session());
};

const bootstrap = async (): Promise<INestApplication> => {
  const app = await NestFactory.create(AppModule);

  // Apply middleware to the application
  applyNestApplicationMiddleware(app);

  // Finally, start the server
  await app.listen(process.env.NEST_PORT);
  return app;
};

void bootstrap();
