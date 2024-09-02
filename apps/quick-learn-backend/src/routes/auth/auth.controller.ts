import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SuccessResponse } from '@src/common/dto';
import { EnvironmentEnum } from '@src/common/constants/constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgotpassword.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import { LoginDto } from './dto';
import { JwtRefreshAuthGuard } from './guards';
import { SessionEntity } from '@src/entities';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/auth/login
@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse> {
    const { token, tokenExpires, refreshToken } = await this.authService.login(
      loginDto,
    );

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      maxAge: tokenExpires,
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      path: '/',
    });

    return new SuccessResponse('Successfully logged in.');
  }

  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse> {
    const cookies = req.headers?.cookie;

    const cookieArray = cookies.split('; ');
    let refresh_token = '';
    for (const cookie of cookieArray) {
      const [name, value] = cookie.split('=');
      if (name === 'refresh_token') {
        refresh_token = value;
        break;
      }
    }

    await this.authService.logout(refresh_token);

    res.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      path: '/',
    });

    res.cookie('refresh_token', '', {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      path: '/',
    });

    return new SuccessResponse('Successfully logged out.');
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
    delete user.password; // TODO: Need to update this to discard this fron the class validators
    return new SuccessResponse('Successfully got the user.', user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @CurrentUser() session: SessionEntity,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse> {
    const { token, expires } = await this.authService.refreshToken(session);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.ENV !== EnvironmentEnum.Developemnt, // TODO: Update this to use config file
      sameSite: 'lax',
      maxAge: expires,
      path: '/',
    });
    return new SuccessResponse('Successfully refreshed the token.');
  }
}
