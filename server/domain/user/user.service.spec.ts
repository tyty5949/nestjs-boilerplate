import { User } from './user.entity';
import { UserService } from './user.service';
import { getMockUser } from '../../__tests__/__mocks__/user';
import { UserRepository } from './user.repository';
import { getLogger } from '../common/logger';
import { getMockConfigService } from '../../__tests__/__mocks__/configService';
import { ConfigService } from '@nestjs/config';

describe('UserService', () => {
  let userService: UserService;
  let savedUser: User;
  let mockUserRepository: Partial<UserRepository>;

  beforeEach(() => {
    mockUserRepository = getMockUserRepository();
    const mockConfigService = getMockConfigService();
    userService = new UserService(
      getLogger(),
      mockUserRepository as UserRepository,
      mockConfigService as ConfigService,
    );
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

    it('should return undefined on db error', async () => {
      mockUserRepository.insert = jest
        .fn()
        .mockResolvedValue({ identifiers: [], generatedMaps: [] });

      const registeredUser = await userService.registerUser(
        'test@qa.com',
        'password',
      );

      expect(registeredUser).toBe(undefined);
    });

    it('should return undefined if user fails validation', async () => {
      jest.spyOn(userService, 'toUser').mockImplementation(() => {
        throw new Error('Test validation error!');
      });

      const registeredUser = await userService.registerUser(
        'test@qa.com',
        'password',
      );

      expect(registeredUser).toBe(undefined);
    });
  });

  describe('#toUser()', () => {
    it('should convert id to number', async () => {
      const user = await userService.toUser({ id: '1234' });
      expect(typeof user.id).toEqual('number');
    });

    it('should convert passwordHash to buffer', async () => {
      const user = await userService.toUser({
        passwordHash:
          '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq',
      });
      expect(user.passwordHash).toBeInstanceOf(Buffer);
      expect(user.passwordHash.toString()).toEqual(
        '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq',
      );
    });

    it('should convert createdAt to date', async () => {
      const user = await userService.toUser({
        createdAt: '2020-08-02T22:14:48.174Z',
      });
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt).toEqual(new Date('2020-08-02T22:14:48.174Z'));
    });

    it('should convert updatedAt to date', async () => {
      const user = await userService.toUser({
        updatedAt: '2020-08-02T22:14:48.174Z',
      });
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toEqual(new Date('2020-08-02T22:14:48.174Z'));
    });

    it('should convert deletedAt to date', async () => {
      const user = await userService.toUser({
        deletedAt: '2020-08-02T22:14:48.174Z',
      });
      expect(user.deletedAt).toBeInstanceOf(Date);
      expect(user.deletedAt).toEqual(new Date('2020-08-02T22:14:48.174Z'));
    });

    it('should exclude extraneous values', async () => {
      const user = await userService.toUser({
        id: 1234,
        test: 'this_is_a_test',
      });
      expect(user).not.toMatchObject({ test: 'this_is_a_test' });
      expect(user).toMatchObject({ id: 1234 });
    });
  });

  describe('#toHistoryObject()', () => {
    it('should exclude passwordHash in history object', async () => {
      const user = await userService.toUser({
        passwordHash:
          '$2b$10$a5kfUlACNsuMYt8dH98F5OkT/XiB2SYbwsBk7ocBG.Gjtb.XbtVzq',
      });
      const json = JSON.stringify(userService.getHistoryObject(user));
      expect(json).not.toContain('passwordHash');
      expect(json).not.toContain('password_hash');
    });

    it('should exclude extraneous values', async () => {
      const user = await userService.toUser({
        id: 1234,
        test: 'this_is_a_test',
      });
      const json = JSON.stringify(userService.getHistoryObject(user));
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
