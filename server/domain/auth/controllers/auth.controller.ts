import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Logger } from '../../common/logger';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { Response } from 'express';

@Controller('/')
export class AuthController {
  constructor(protected logger: Logger) {}

  @Get('/login')
  @Render('auth/login')
  login(@Req() req: PassportRequest, @Res() res: Response): unknown {
    if (req.isAuthenticated()) {
      res.redirect('/app/home');
      return null;
    }

    // this.logger.info('Hitting login route');
    return {};
  }

  @Get('/register')
  @Render('auth/register')
  register(@Req() req: PassportRequest, @Res() res: Response): unknown {
    if (req.isAuthenticated()) {
      res.redirect('/app/home');
      return null;
    }

    // this.logger.info('Hitting login route');
    return {};
  }
}
