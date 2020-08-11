import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export interface AppConfig {
  maxSessionAge: number;
}

export interface AuthConfig {
  passwordSaltLength: number;
  hashedPasswordLength: number;
  recaptchaSiteKey: string;
  recaptchaThreshold: number;
  recaptchaSecret: string;
}

const configuration = () => {
  return {
    app: {
      // Session cookie is valid for 6 hours (given in ms)
      maxSessionAge: 21600000,
    } as AppConfig,
    auth: {
      passwordSaltLength: 10,
      hashedPasswordLength: 60,
      recaptchaSiteKey: '6LesKwAVAAAAAJ5noSPNAD0_2sbuqFZ3qVwm1anL',
      recaptchaThreshold: 0.5,
      recaptchaSecret: process.env.RECAPTCHA_SECRET,
    } as AuthConfig,
  };
};

export const NestConfigModule: DynamicModule = ConfigModule.forRoot({
  load: [configuration],
});
