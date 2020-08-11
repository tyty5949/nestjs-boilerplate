import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Logger } from '../../common/logger';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from '../../../config';

@Controller('/')
export class AuthController {
  constructor(
    protected logger: Logger,
    protected configService: ConfigService,
  ) {}

  @Get('/login')
  @Render('auth/login')
  login(@Req() req: PassportRequest, @Res() res: Response): unknown {
    if (req.isAuthenticated()) {
      return res.redirect('/app/home');
    }

    return {
      recaptchaSiteKey: this.configService.get<AuthConfig>('auth')
        .recaptchaSiteKey,
    };
  }

  @Get('/register')
  @Render('auth/register')
  register(@Req() req: PassportRequest, @Res() res: Response): unknown {
    if (req.isAuthenticated()) {
      return res.redirect('/app/home');
    }

    return {
      recaptchaSiteKey: this.configService.get<AuthConfig>('auth')
        .recaptchaSiteKey,
    };
  }
}
