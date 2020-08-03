import { AuthApiController } from './auth.api-controller';
import { InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { RegisterDTO } from './models/register.dto';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { UserService } from '../../user/user.service';
import { getLogger } from '../../common/logger';

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
    );

    mockReq = {} as PassportRequest;
    mockRes = {} as Response;
    mockBody = {} as RegisterDTO;
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
    it('should redirect to /app/home after login guard', () => {
      mockRes.redirect = jest.fn();
      authApiController.login(mockRes);
      expect(mockRes.redirect).toHaveBeenCalledWith('/app/home');
    });
  });

  describe('#logout()', () => {
    it('should attempt to logout the user', () => {
      mockReq.logout = jest.fn();
      mockRes.redirect = jest.fn();
      authApiController.logout(mockReq, mockRes);
      expect(mockReq.logout).toHaveBeenCalled();
    });

    it('should redirect to /login after successfully logging out the user', () => {
      mockReq.logout = jest.fn();
      mockRes.redirect = jest.fn();
      authApiController.logout(mockReq, mockRes);
      expect(mockRes.redirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('#register()', () => {
    it('should redirect to /app/home if user is already authenticated', async () => {
      mockReq.isAuthenticated = jest.fn().mockReturnValue(true);
      mockRes.redirect = jest.fn();
      mockUserService.registerUser = jest.fn();

      await authApiController.register(mockReq, mockRes, mockBody);

      expect(mockRes.redirect).toHaveBeenCalledWith('/app/home');
      expect(mockUserService.registerUser).not.toHaveBeenCalled();
    });

    it('should throw internal error if issue registering user', async () => {
      mockReq.isAuthenticated = jest.fn().mockReturnValue(false);
      mockUserService.registerUser = jest.fn().mockResolvedValue(undefined);

      await expect(() => {
        return authApiController.register(mockReq, mockRes, mockBody);
      }).rejects.toThrow(InternalServerErrorException);
    });

    it('should attempt login if user is registered', async () => {
      mockReq.isAuthenticated = jest.fn().mockReturnValue(false);
      mockReq.logIn = jest.fn();
      const mockUser = { id: 1234 };
      mockUserService.registerUser = jest.fn().mockResolvedValue(mockUser);

      await authApiController.register(mockReq, mockRes, mockBody);

      expect(mockReq.logIn).toHaveBeenCalledWith(mockUser, expect.anything());
    });

    it('should throw internal error if login fails', async () => {
      mockReq.isAuthenticated = jest.fn().mockReturnValue(false);
      mockReq.logIn = jest
        .fn()
        .mockImplementation((user, cb: (err) => void) => {
          return cb(new Error('There was an error!'));
        });
      const mockUser = { id: 1234 };
      mockUserService.registerUser = jest.fn().mockResolvedValue(mockUser);

      await expect(() => {
        return authApiController.register(mockReq, mockRes, mockBody);
      }).rejects.toThrow(InternalServerErrorException);
    });

    it('should redirect to /app/home after successful registration', async () => {
      mockRes.redirect = jest.fn();
      mockReq.isAuthenticated = jest.fn().mockReturnValue(false);
      mockReq.logIn = jest
        .fn()
        .mockImplementation((user, cb: (err) => void) => {
          return cb(null);
        });
      const mockUser = { id: 1234 };
      mockUserService.registerUser = jest.fn().mockResolvedValue(mockUser);

      await authApiController.register(mockReq, mockRes, mockBody);

      expect(mockRes.redirect).toHaveBeenCalledWith('/app/home');
      expect(mockReq.logIn).toHaveBeenCalled();
    });
  });
});
