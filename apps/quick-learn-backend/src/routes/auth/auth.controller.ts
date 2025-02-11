import {
  Body,
  Controller,
  Delete,
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
import Helpers from '@src/common/utils/helper';
import { en } from '@src/lang/en';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/auth/login
@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SuccessResponse> {
    const { token, tokenExpires, refreshToken, role } =
      await this.authService.login(loginDto);

    Helpers.setCookies(res, 'access_token', token, tokenExpires);
    Helpers.setCookies(res, 'refresh_token', refreshToken);
    Helpers.setCookies(res, 'user_role', role.toString());
    return new SuccessResponse(en.successfullyLoggedIn);
  }

  @Delete('logout')
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
    Helpers.clearCookies(res);
    return new SuccessResponse(en.successfullyLoggedOut);
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
    return new SuccessResponse(en.successfullyGotUser, user);
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
    return new SuccessResponse(en.successfullyRefreshToken);
  }
}
