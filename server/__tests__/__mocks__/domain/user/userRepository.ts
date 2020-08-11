import { User } from '../../../../domain/user/user.entity';
import { UserRepository } from '../../../../domain/user/user.repository';

export const getMockUserRepository = (
  users: Partial<User>[],
): Partial<UserRepository> => {
  return {
    findOneById: jest.fn().mockImplementation((id) => {
      return Promise.resolve(
        users.find((u) => {
          return u.id === id;
        }),
      );
    }),
    findOneByEmail: jest.fn().mockImplementation((email) => {
      return Promise.resolve(
        users.find((u) => {
          return u.email === email;
        }),
      );
    }),
    insert: jest.fn(),
  };
};
