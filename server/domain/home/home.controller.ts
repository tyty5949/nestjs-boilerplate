import React from 'react';
import ReactDomServer from 'react-dom/server';
import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { Logger } from '../common/logger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { App } from '../common/components/app';

@Controller('/')
export class HomeController {
  constructor(protected logger: Logger) {}

  @Get('/home')
  @Render('app/home')
  @UseGuards(AuthenticatedGuard)
  home() {
    const element = React.createElement(App);
    const app = ReactDomServer.renderToString(element);
    return { app };
  }
}
