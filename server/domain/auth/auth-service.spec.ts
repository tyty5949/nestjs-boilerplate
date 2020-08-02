import { AuthService } from './auth.service';
import { getMockUser } from '../../__tests__/__mocks__/user';
import { User } from '../user/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUser: User;
  let mockUserRepository;

  beforeEach(() => {
    mockUser = getMockUser({ email: 'test@qa.com', password: 'password' });
    mockUserRepository = getMockUserRepository(mockUser);
    authService = new AuthService(mockUserRepository);
  });

  describe('#validateUser()', () => {
    it('should not validate user with no email', async () => {
      expect(await authService.validateUser('', 'password')).toEqual(undefined);
      expect(await authService.validateUser(undefined, 'password')).toEqual(
        undefined,
      );
      expect(await authService.validateUser(null, 'password')).toEqual(
        undefined,
      );
      expect(await authService.validateUser(' ', 'password')).toEqual(
        undefined,
      );
    });

    it('should not validate user with no password', async () => {
      expect(await authService.validateUser('test@qa.com', '')).toEqual(
        undefined,
      );
      expect(await authService.validateUser('test@qa.com', undefined)).toEqual(
        undefined,
      );
      expect(await authService.validateUser('test@qa.com', null)).toEqual(
        undefined,
      );
      expect(await authService.validateUser('test@qa.com', ' ')).toEqual(
        undefined,
      );
    });

    it('should validate user with proper email and password', async () => {
      expect(await authService.validateUser('test@qa.com', 'password')).toEqual(
        mockUser,
      );
    });

    it('should validate user regardless of email case', async () => {
      expect(await authService.validateUser('Test@qa.com', 'password')).toEqual(
        mockUser,
      );
      expect(await authService.validateUser('TEST@QA.COM', 'password')).toEqual(
        mockUser,
      );
      expect(await authService.validateUser('test@Qa.com', 'password')).toEqual(
        mockUser,
      );
      expect(await authService.validateUser('test@qa.Com', 'password')).toEqual(
        mockUser,
      );
      expect(await authService.validateUser('teSt@qa.com', 'password')).toEqual(
        mockUser,
      );
    });
  });
});

const getMockUserRepository = (mockUser: User) => ({
  findOneByEmail: jest.fn().mockImplementation((email) => {
    if (email === mockUser.email) {
      return Promise.resolve(mockUser);
    }
    return Promise.resolve(undefined);
  }),
});
