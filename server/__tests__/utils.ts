import supertest from 'supertest';
import Http2 from 'http2';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { getConnection } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loadPartials } from '../utils/hbs';
import { applyNestApplicationMiddleware } from '../main';

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
    .expect(Http2.constants.HTTP_STATUS_FOUND)
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

  // Create testing app
  const app = moduleRef.createNestApplication<NestExpressApplication>();

  // Apply middleware to the application
  applyNestApplicationMiddleware(app);

  // Load handlebars partials from the /views/common directory
  loadPartials('/views/common');

  // Return the app initialized for testing!
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
