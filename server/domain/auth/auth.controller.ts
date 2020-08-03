import { Controller, Get, Render } from '@nestjs/common';
import { Logger } from '../common/logger';

@Controller('/')
export class AuthController {
  constructor(protected logger: Logger) {}

  @Get('/login')
  @Render('auth/login')
  login() {
    // this.logger.info('Hitting login route');
    return {};
  }

  @Get('/register')
  @Render('auth/register')
  register() {
    // this.logger.info('Hitting login route');
    return {};
  }
}
