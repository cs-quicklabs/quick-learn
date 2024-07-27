import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/auth/login
@ApiTags('Authentication')
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
