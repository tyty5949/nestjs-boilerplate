import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<PassportRequest>();
    return request.isAuthenticated();
  }
}
