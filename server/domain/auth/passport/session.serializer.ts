import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { SessionUser } from '../types/sessionUser';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  /*
   * Serializes a user to a session. Include any data here that needs to be
   * cached within the user's session.
   * NOTE: This is written to the sessions table under the json column
   */
  serializeUser(
    user: User,
    done: (err: Error, user: SessionUser) => void,
  ): any {
    done(null, { id: user.id, accountId: user.accountId, email: user.email });
  }

  /*
   * Deserializes a user from their session and places the output
   * the req.user field. Include any data here that the user may need
   * that's not already included from their session caches.
   */
  deserializeUser(
    payload: Record<string, unknown>,
    done: (err: Error, payload: SessionUser) => void,
  ): any {
    done(null, {
      id: Number(payload.id),
      accountId: String(payload.accountId),
      email: String(payload.email),
    });
  }
}
