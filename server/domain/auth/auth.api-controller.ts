import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginGuard } from './guards/login.guard';
import { PassportRequest } from '../common/interfaces/passportRequest.interface';
import { AuthMeResponse } from './interfaces/authMeResponse.interface';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './models/register.dto';
import { Logger } from '../common/logger';

@Controller('/api/auth')
export class AuthApiController {
  constructor(protected logger: Logger, protected userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/me')
  me(@Request() req: PassportRequest): AuthMeResponse {
    const user = req.user;

    if (!user) {
      this.logger.error('Authenticated request has no user');
      throw new InternalServerErrorException();
    }

    return {
      accountId: user.accountId,
      email: user.email,
    };
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response): void {
    res.redirect('/app/home');
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  logout(@Req() req: PassportRequest, @Res() res: Response): void {
    req.logout();
    res.redirect('/login');
  }

  @Post('/register')
  async register(
    @Req() req: PassportRequest,
    @Res() res: Response,
    @Body() registerDto: RegisterDTO,
  ): Promise<void> {
    if (req.isAuthenticated()) {
      res.redirect('/app/home');
      return;
    }

    const user = await this.userService.registerUser(
      registerDto.email,
      registerDto.password,
    );

    if (!user) {
      this.logger.error(
        'Error registering user (user is null)',
        { email: registerDto.email },
      );
      throw new InternalServerErrorException();
    }

    req.logIn(user, (err) => {
      if (err) {
        this.logger.error(
          'Error logging user in after registration',
          { user: this.userService.getHistoryObject(user) },
        );
        throw new InternalServerErrorException();
      }

      res.redirect('/app/home');
    });
  }
}
