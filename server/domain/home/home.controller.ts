import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { Logger } from '../common/logger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

@Controller('/')
export class HomeController {
  constructor(protected logger: Logger) {}

  @Get('/home')
  @Render('app/home')
  @UseGuards(AuthenticatedGuard)
  home() {
    return {};
  }
}
