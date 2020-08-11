import { RecaptchaGuard } from './recaptcha.guard';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { ConfigService } from '@nestjs/config';
import { getMockConfigService } from '../../../__tests__/__mocks__/configService';

describe('RecaptchaGuard', () => {
  let recaptchaGuard: RecaptchaGuard;

  beforeEach(() => {
    const configService = getMockConfigService({
      auth: {
        recaptchaThreshold: 0.5,
        recaptchaSecret: 'my_secret',
      },
    }) as ConfigService;

    recaptchaGuard = new RecaptchaGuard(configService);
  });

  describe('#buildRecaptchaVerificationUrl()', () => {
    it('should build proper recaptcha url', () => {
      const mockRequest = {
        ip: '192.168.1.2',
      } as PassportRequest;
      const mockRecaptchaResponse = 'my_response';

      const url = recaptchaGuard.buildRecaptchaVerificationUrl(
        mockRequest,
        mockRecaptchaResponse,
      );
      expect(url).toEqual(
        'https://www.google.com/recaptcha/api/siteverify?secret=my_secret&response=my_response&remoteip=192.168.1.2',
      );
    });
  });

  describe('#canActivate()', () => {
    // TODO
  });
});
