// dotenv doesn't have types :\
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-var-requires
require('dotenv').config();

import supertest from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Session } from '../domain/auth/entities/session.entity';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import * as passport from 'passport';
import { getConnection, getRepository } from 'typeorm';
import { Constants } from '../utils/constants';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loadPartials } from '../utils/hbs';

/**
 * Helper function for tests which attempts authentication using
 * the given email and password on the given agent.
 *
 * If successful, then the agent will store the session cookie and
 * be authenticated until reset.
 *
 * @param agent
 * @param email
 * @param password
 */
export const authenticateAgent = (
  agent: supertest.SuperAgentTest,
  email: string,
  password: string,
): Promise<supertest.SuperAgentTest> => {
  return agent
    .post('/api/auth/login')
    .send({ email, password })
    .expect(Constants.http.HTTP_STATUS_FOUND)
    .then(() => {
      return agent;
    });
};

export const createTestingNestApplication = async (): Promise<
  NestExpressApplication
> => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>();

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
        maxAge: Constants.app.maxSessionAge,
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

  // Set the view engine to use Handlebars
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  // Load hbs partials from common directory
  loadPartials('common');

  // Use a global validator for requests
  app.useGlobalPipes(new ValidationPipe());

  // applyNestApplicationMiddleware(app);
  return app.init();
};

export const closeTestingNestApplication = (
  app: INestApplication,
): Promise<void> => {
  return app.close().then(() => {
    const conn = getConnection();
    if (conn.isConnected) {
      return conn.close();
    }
    return Promise.resolve();
  });
};
