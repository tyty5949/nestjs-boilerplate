import { Request } from 'express';
import { User } from '../../user/user.entity';
import { ISession } from 'connect-typeorm';
import { SessionUser } from '../../auth/models/sessionUser';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
interface PassportSession extends ISession, Express.Session {
  passport: {
    user: Partial<User>;
  };
}

/*
 * The global type defined in @types/passport is being overridden
 * by node.js's global Request type...
 *
 * This is copied from @types/passport...
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/passport/index.d.ts
 */
export interface PassportRequest extends Request {
  authInfo?: any;
  user?: SessionUser;

  // These declarations are merged into express's Request type
  login(user: User, done: (err: any) => void): void;
  login(user: User, options: any, done: (err: any) => void): void;
  logIn(user: User, done: (err: any) => void): void;
  logIn(user: User, options: any, done: (err: any) => void): void;

  logout(): void;
  logOut(): void;

  isAuthenticated(): boolean;
  isUnauthenticated(): boolean;

  session: PassportSession;
}
