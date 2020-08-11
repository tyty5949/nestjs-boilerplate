import { AuthenticatedGuard } from './authenticated.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthenticatedGuard', () => {
  let authenticatedGuard: AuthenticatedGuard;

  beforeEach(() => {
    authenticatedGuard = new AuthenticatedGuard();
  });

  it('should not activate if not authenticated', () => {
    const mockContext = getNonAuthenticatedExecutionContext();
    expect(authenticatedGuard.canActivate(mockContext)).toBe(false);
  });

  it('should activate if authenticated', () => {
    const mockContext = getAuthenticatedExecutionContext();
    expect(authenticatedGuard.canActivate(mockContext)).toBe(true);
  });
});

const getNonAuthenticatedExecutionContext = () => {
  return getMockExecutionContext(false);
};

const getAuthenticatedExecutionContext = () => {
  return getMockExecutionContext(true);
};

const getMockExecutionContext = (
  isAuthenticated: boolean,
): ExecutionContext => {
  return {
    switchToHttp: () => {
      return {
        getRequest: () => {
          return {
            isAuthenticated: () => {
              return isAuthenticated;
            },
          };
        },
      };
    },
  } as ExecutionContext;
};
