import { AuthenticatedGuard } from './authenticated.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthenticatedGuard', () => {
  let authenticatedGuard: AuthenticatedGuard;

  beforeEach(() => {
    authenticatedGuard = new AuthenticatedGuard();
  });

  it('should not activate if not authenticated', () => {
    const mockContext = getMockExecutionContext(false);
    expect(authenticatedGuard.canActivate(mockContext)).toBe(false);
  });

  it('should activate if authenticated', () => {
    const mockContext = getMockExecutionContext(true);
    expect(authenticatedGuard.canActivate(mockContext)).toBe(true);
  });
});

const getMockExecutionContext = (
  isAuthenticated: boolean,
): ExecutionContext => {
  return {
    switchToHttp: () => {
      return {
        getRequest: () => {
          return {
            isAuthenticated: () => isAuthenticated,
          };
        },
      };
    },
  } as ExecutionContext;
};
