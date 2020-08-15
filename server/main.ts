import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepository } from 'typeorm';
import { TypeormStore } from 'connect-typeorm';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import { Session } from './domain/auth/entities/session.entity';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { loadPartials } from './utils/hbs';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config';

export const applyNestApplicationMiddleware = (
  app: NestExpressApplication,
): void => {
  const configService = app.get(ConfigService);

  /*
   * Must come before other calls to app.use() or setup functions that may call app.use()
   * @see https://docs.nestjs.com/techniques/security#helmet
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(helmet());

  // Set the view engine to use Handlebars
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

  /*
   * Sets up the express-session for use in nestjs.
   * @see https://github.com/expressjs/session#readme
   *
   * Session data is also persisted to the database using TypeORM
   * so that is setup here as well.
   * @see https://github.com/nykula/connect-typeorm#readme
   */
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
        maxAge: configService.get<AppConfig>('app').maxSessionAge,
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

  // Use a global validator for requests
  app.useGlobalPipes(new ValidationPipe());
};

const bootstrap = async (): Promise<NestExpressApplication> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Apply middleware to the application
  applyNestApplicationMiddleware(app);

  // Load handlebars partials from the /views/common directory
  loadPartials('/views/common');

  // Finally, start the server!
  await app.listen(process.env.NEST_PORT);
  return app;
};

void bootstrap();
