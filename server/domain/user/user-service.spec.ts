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
      const registeredUser = await userService.registerUser('test@qa.com', 'password');

      expect(registeredUser).toMatchObject({email: 'test@qa.com'} );
      expect(savedUser).toMatchObject({email: 'test@qa.com'});
    });
  });

  const getMockUserRepository = () => {
    return {
      connection: null,
      insert: jest.fn().mockImplementation(user => {
        savedUser = getMockUser(user);
        return Promise.resolve({
          identifiers: ['1234'],
          generatedMaps: [JSON.parse(JSON.stringify(savedUser))],
        });
      }),
    };
  }
})
