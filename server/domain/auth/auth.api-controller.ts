import {
  Controller,
  Get,
  Post,
  Res,
  Request,
  UseGuards,
  Req,
  Logger,
  InternalServerErrorException,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LoginGuard } from './guards/login.guard';
import { PassportRequest } from '../common/interfaces/passportRequest.interface';
import { AuthMeResponse } from './interfaces/authMeResponse.interface';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './models/register.dto';

@Controller('/api/auth')
export class AuthApiController {
  constructor(protected logger: Logger, protected userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @Get('/me')
  me(@Request() req: PassportRequest): AuthMeResponse {
    const user = req.user;

    if (!user) {
      this.logger.error('Authenticated request has no user!');
      throw new InternalServerErrorException();
    }

    return {
      accountId: user.accountId,
      email: user.email,
    };
  }

  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Req() req: PassportRequest, @Res() res: Response): void {
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
      throw new InternalServerErrorException('Error registering user!');
    }

    req.logIn(user, (err) => {
      if (err) {
        throw new InternalServerErrorException(
          'Error logging user in after registration!',
        );
      }

      res.redirect('/app/home');
    });
  }
}
