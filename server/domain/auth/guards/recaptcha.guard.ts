import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { constants as HttpConstants } from 'http2';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { default as Axios } from 'axios';
import { RecaptchaVerifyResponse } from '../types/responses/recaptchaVerify.response';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../../config';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  constructor(protected configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PassportRequest>();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const recaptchaResponse = request.body.response as string;
    if (!recaptchaResponse) {
      return false;
    }

    const url = this.buildRecaptchaVerificationUrl(request, recaptchaResponse);
    const response = await Axios.post<RecaptchaVerifyResponse>(url);

    return !!(
      response.status === HttpConstants.HTTP_STATUS_OK &&
      response.data.success &&
      response.data.action === 'submit' &&
      response.data.score >
        this.configService.get<AuthConfig>('auth').recaptchaThreshold
    );
  }

  buildRecaptchaVerificationUrl(
    request: PassportRequest,
    recaptchaResponse: string,
  ): string {
    return (
      'https://www.google.com/recaptcha/api/siteverify' +
      `?secret=${this.configService.get<AuthConfig>('auth').recaptchaSecret}` +
      `&response=${recaptchaResponse}` +
      `&remoteip=${request.ip}`
    );
  }
}
