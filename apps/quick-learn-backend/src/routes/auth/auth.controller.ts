import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SuccessResponse } from '@src/common/dto';
import { EnvironmentEnum } from '@src/common/constants/constants';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/auth/login
@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse | void> {
    const token = await this.authService.login(req.user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.ENV === EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // TODO: Need to update this base on  the env or remember me.
      path: '/',
    });
    return new SuccessResponse('Successfully logged in.', token);
  }

  @Post('forgot/password')
  @ApiOperation({ summary: 'Forgot Password' })
  forgotPassword() {
    return this.authService.forgotPassword();
  }

  @Post('reset/password')
  @ApiOperation({ summary: 'Reset Password' })
  resetPassword() {
    return this.authService.resetPassword();
  }

  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse | void> {
    const token = await this.authService.logout();
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.ENV === EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      // maxAge: 24 * 60 * 60 * 1000, // TODO: Need to update this base on  the env or remember me.
      path: '/',
    });
    return new SuccessResponse('Successfully logged out.', token);
  }

  @Get('profile')
  getProfile(@Req() req: Request): SuccessResponse {
    const user = req.user;
    return new SuccessResponse('Successfully got the user.', user);
  }
}
