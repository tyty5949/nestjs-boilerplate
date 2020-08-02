import { User } from './user.entity';
import { UserService } from './user.service';
import { Logger } from '@nestjs/common';
import { getMockUser } from '../../__tests__/__mocks__/user';

describe('UserService', () => {
  let userService: UserService;
  let savedUser: User;
  let mockUserRepository;

  beforeEach(() => {
    mockUserRepository = getMockUserRepository();
    userService = new UserService(new Logger(), mockUserRepository);
  });

  describe('#registerUser()', () => {
    it('should register user with given email', async () => {
      const registeredUser = await userService.registerUser(
        'test@qa.com',
        'password',
      );

      expect(registeredUser).toMatchObject({ email: 'test@qa.com' });
      expect(savedUser).toMatchObject({ email: 'test@qa.com' });
    });
  });

  describe('#toUser()', () => {
    it('should convert id to number', async() => {
      const user = await userService.toUser({ id: '1234' });
      expect(typeof user.id).toEqual('number');
    });

    it('should convert passwordHash to buffer', async() => {
      const user = await userService.toUser({ passwordHash: '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq' });
      expect(user.passwordHash).toBeInstanceOf(Buffer);
      expect(user.passwordHash.toString()).toEqual('$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq');
    });

    it('should convert createdAt to date', async() => {
      const user = await userService.toUser({ createdAt: '2020-08-02T22:14:48.174Z' });
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt).toEqual(new Date('2020-08-02T22:14:48.174Z'));
    });

    it('should convert updatedAt to date', async() => {
      const user = await userService.toUser({ updatedAt: '2020-08-02T22:14:48.174Z' });
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toEqual(new Date('2020-08-02T22:14:48.174Z'));
    });

    it('should convert deletedAt to date', async() => {
      const user = await userService.toUser({ deletedAt: '2020-08-02T22:14:48.174Z' });
      expect(user.deletedAt).toBeInstanceOf(Date);
      expect(user.deletedAt).toEqual(new Date('2020-08-02T22:14:48.174Z'));
    });

    it('should exclude extraneous values', async () => {
      const user = await userService.toUser({id: 1234, test: 'this_is_a_test'})
      expect(user).not.toMatchObject({test: 'this_is_a_test'});
      expect(user).toMatchObject({id: 1234});
    });
  });

  describe('#toHistoryJSON()', () => {
    it('should exclude passwordHash in history json', async () => {
      const user = await userService.toUser({passwordHash: '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq'})
      const json = userService.getHistoryJSON(user);
      expect(json).not.toContain('passwordHash');
      expect(json).not.toContain('password_hash');
    });

    it('should exclude extraneous values', async () => {
      const user = await userService.toUser({id: 1234, test: 'this_is_a_test'});
      const json = userService.getHistoryJSON(user);
      expect(json).toContain('id');
      expect(json).not.toContain('test');
      expect(json).not.toContain('this_is_a_test');
    });
  });

  const getMockUserRepository = () => {
    return {
      connection: null,
      insert: jest.fn().mockImplementation((user) => {
        savedUser = getMockUser(user);
        return Promise.resolve({
          identifiers: ['1234'],
          generatedMaps: [JSON.parse(JSON.stringify(savedUser))],
        });
      }),
    };
  };
});
