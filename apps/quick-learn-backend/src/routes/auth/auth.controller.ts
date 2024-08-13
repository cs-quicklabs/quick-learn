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
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';

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
  ): Promise<SuccessResponse> {
    const token = await this.authService.login(req.user);

    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // TODO: Need to update this base on  the env or remember me.
      path: '/',
    });
    return new SuccessResponse('Successfully logged in.', token);
  }

  // Logout
  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse | void> {
    const token = await this.authService.logout();
    res.cookie('access_token', token.access_token, {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // TODO: Need to update this base on  the env or remember me.
      path: '/',
    });
    return new SuccessResponse('Successfully logged out.', token);
  }

  @Post('forgot/password')
  @ApiOperation({ summary: 'Forgot Password' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @ApiOperation({ summary: 'Reset Password' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.resetToken,
      resetPasswordDto.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: UserEntity): SuccessResponse {
    return new SuccessResponse('Successfully got the user.', user);
  }
}
