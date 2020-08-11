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
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { PassportRequest } from '../../common/interfaces/passportRequest.interface';
import { UserService } from '../../user/user.service';
import { Logger } from '../../common/logger';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { LoginResponse } from '../types/responses/login.response';
import { AuthMeResponse } from '../types/responses/authMe.response';
import { LoginDTO } from '../types/login.dto';
import { RegisterDTO } from '../types/register.dto';
import { RegisterResponse } from '../types/responses/register.response';
import { UserRepository } from '../../user/user.repository';
import { RecaptchaGuard } from '../guards/recaptcha.guard';

@Controller('/api/auth')
export class AuthApiController {
  loginSuccessResponse = {
    success: true,
    redirect: '/app/home',
  } as LoginResponse;

  loginFailureResponse = {
    success: false,
  } as LoginResponse;

  registerSuccessResponse = {
    success: true,
    redirect: '/app/home',
  } as LoginResponse;

  constructor(
    protected logger: Logger,
    protected userService: UserService,
    protected userRepository: UserRepository,
    protected authService: AuthService,
  ) {}

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

  @UseGuards(RecaptchaGuard)
  @Post('/login')
  async login(
    @Req() req: PassportRequest,
    @Body() loginDto: LoginDTO,
  ): Promise<LoginResponse> {
    if (req.isAuthenticated()) {
      return this.loginSuccessResponse;
    }

    // Attempt validation of user's credentials
    let result: User;
    try {
      result = await this.validateUserOrFail(loginDto);
    } catch (e) {
      return this.loginFailureResponse;
    }

    /*
     * At this point the user is validated so we need to "log" them in with passport
     * so that their session gets created.
     */
    await this.logInUserOrFail(req, result);

    return this.loginSuccessResponse;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/logout')
  logout(@Req() req: PassportRequest, @Res() res: Response): void {
    req.logout();
    res.redirect('/login');
  }

  @UseGuards(RecaptchaGuard)
  @Post('/register')
  async register(
    @Req() req: PassportRequest,
    @Body() registerDto: RegisterDTO,
  ): Promise<RegisterResponse> {
    if (req.isAuthenticated()) {
      return this.registerSuccessResponse;
    }

    /*
     * Attempt to lookup a user with the desired email to verify that
     * and account doesn't already exist.
     */
    const foundUser = await this.userRepository.findOneByEmail(
      registerDto.email.toLowerCase(),
    );
    if (foundUser) {
      return this.buildRegisterFailureResponse(
        'An account with that email already exists!',
      );
    }

    // Attempt to register the user with their desired credentials
    const user = await this.registerUserOrFail(registerDto);

    /*
     * At this point the user is created so we need to "log" them in with passport
     * so that their session gets created.
     */
    await this.logInUserOrFail(req, user);

    return this.registerSuccessResponse;
  }

  async validateUserOrFail(loginDto: LoginDTO): Promise<User> {
    const result = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!result) {
      throw new Error('Unable to validate user');
    }
    return result;
  }

  async logInUserOrFail(req: PassportRequest, user: User): Promise<void> {
    const logInSuccess = await new Promise<boolean>((resolve) => {
      req.logIn(user, (err) => {
        resolve(!err);
      });
    });

    if (!logInSuccess) {
      this.logger.error('Error logging in authenticated user', {
        user: this.userService.getHistoryObject(user),
      });
      throw new InternalServerErrorException();
    }
  }

  async registerUserOrFail(registerDto: RegisterDTO): Promise<User> {
    const user = await this.userService.registerUser(
      registerDto.email,
      registerDto.password,
    );

    if (!user) {
      this.logger.error('Error registering user (user is null)', {
        email: registerDto.email,
      });
      throw new InternalServerErrorException();
    }

    return user;
  }

  buildRegisterFailureResponse(reason: string): RegisterResponse {
    return {
      success: false,
      failureReason: reason,
    } as RegisterResponse;
  }
}
