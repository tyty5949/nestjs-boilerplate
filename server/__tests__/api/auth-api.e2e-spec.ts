import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {
  authenticateAgent,
  closeTestingNestApplication,
  createTestingNestApplication,
} from '../utils';
import { getConnection } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let agent: request.SuperAgentTest;

  beforeEach(async () => {
    app = await createTestingNestApplication();
    await getConnection().query(seedSql);

    agent = request.agent(app.getHttpServer());
  });

  afterEach(async () => {
    await getConnection().query(truncateUsersSql);
    await getConnection().query(truncateSessionsSql);
    await closeTestingNestApplication(app);
  });

  describe('/api/auth/login (POST)', () => {
    it('should login user with correct credentials', async () => {
      await agent
        .post('/api/auth/login')
        .send({ email: 'test@qa.com', password: 'password' })
        .expect(302, 'Found. Redirecting to /app/home')
        .expect('location', '/app/home')
        .expect('set-cookie', /user_session=/);
    });

    it('should not login user with incorrect credentials', async () => {
      await agent
        .post('/api/auth/login')
        .send({ email: 'test@qa.com', password: 'wrong_password' })
        .expect(401, `{"statusCode":401,"message":"Unauthorized"}`);
    });
  });

  describe('/api/auth/logout (POST)', () => {
    it('should logout logged in user', async () => {
      await authenticateAgent(agent, 'test@qa.com', 'password');

      await agent
        .post('/api/auth/logout')
        .expect(302, 'Found. Redirecting to /login')
        .expect('location', '/login');

      await agent
        .get('/api/auth/me')
        .expect(403)
        .expect(
          `{"statusCode":403,"message":"Forbidden resource","error":"Forbidden"}`,
        );
    });
  });

  describe('/api/auth/me (GET)', () => {
    it('should return info about logged in user', async () => {
      await authenticateAgent(agent, 'test@qa.com', 'password');

      await agent.get('/api/auth/me').expect(200).expect('Content-Type', /json/);
    });
  });

  describe('/api/auth/register (POST)', () => {
    it('should redirect if already logged in', async () => {
      await authenticateAgent(agent, 'test@qa.com', 'password');

      await agent
        .post('/api/auth/register')
        .send({})
        .expect(302, 'Found. Redirecting to /app/home')
        .expect('location', '/app/home');
    });

    it('should register and login new user', async () => {
      await agent
        .post('/api/auth/register')
        .send({ email: 'register_user@qa.com', password: 'password' })
        .expect(302, 'Found. Redirecting to /app/home')
        .expect('location', '/app/home')
        .expect('set-cookie', /user_session=/);

      await agent
        .get('/api/auth/me')
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
          expect(res.body).toMatchObject({ email: 'register_user@qa.com' });
        });
    });
  });
});

const seedSql = `
INSERT INTO users
  (id, account_id, email, password_hash)
VALUES (143, '84ce7035-7f2d-4b6e-979e-f1abd4962b55', 'test@qa.com', '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq');
`;

const truncateUsersSql = `
TRUNCATE TABLE users;
`;

const truncateSessionsSql = `
TRUNCATE TABLE sessions;
`;
