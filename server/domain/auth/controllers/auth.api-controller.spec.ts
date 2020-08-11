import { AuthApiController } from './auth.api-controller';
import { InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDTO } from '../types/register.dto';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { UserService } from '../../user/user.service';
import { getLogger } from '../../common/logger';
import { UserRepository } from '../../user/user.repository';
import { AuthService } from '../auth.service';

describe('AuthApiController', () => {
  let authApiController: AuthApiController;
  let mockUserService: Partial<UserService>;
  let mockReq: PassportRequest;
  let mockRes: Response;
  let mockBody: RegisterDTO;

  beforeEach(() => {
    mockUserService = {
      getHistoryObject: () => {
        return {};
      },
    } as Partial<UserService>;

    authApiController = new AuthApiController(
      getLogger(),
      mockUserService as UserService,
      {} as UserRepository,
      {} as AuthService,
    );
    mockReq = {} as PassportRequest;
  });

  describe('#me()', () => {
    it('should throw internal error if issue with authentication', () => {
      mockReq.user = undefined;
      expect(() => {
        return authApiController.me(mockReq);
      }).toThrow(InternalServerErrorException);
    });

    it('should return information about user', () => {
      mockReq.user = {
        id: 1234,
        accountId: 'mock-account-id',
        email: 'test@qa.com',
      };

      const result = authApiController.me(mockReq);

      expect(result).toEqual({
        accountId: 'mock-account-id',
        email: 'test@qa.com',
      });
    });
  });

  describe('#login()', () => {
    // TODO
  });

  describe('#logout()', () => {
    // TODO
  });
});
