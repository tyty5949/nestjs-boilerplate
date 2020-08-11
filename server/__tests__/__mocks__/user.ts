import * as bcrypt from 'bcrypt';
import { User } from '../../domain/user/user.entity';

/**
 * Generates an active mock user for use in testing.
 *
 * Default mock User:
 *   email    = test@qa.com
 *   password = password
 *
 * @param partial - Any data you wish to override from the default user
 */
export const getMockUser = (
  partial?: Partial<User> & { password: string },
): User => {
  const mockUser = {
    id: 2,
    accountId: '84ce7035-7f2d-4b6e-979e-f1abd4962b55',
    email: 'test@qa.com',
    passwordHash: Buffer.alloc(
      60,
      '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq',
    ),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const user = Object.assign(mockUser, partial);

  if (partial.password) {
    // Bcrypt has no types :\
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const hashedPassword = bcrypt.hashSync(partial.password, 10) as string;
    user.passwordHash = Buffer.alloc(60, hashedPassword);
    delete user.password;
  }

  return user as User;
};
