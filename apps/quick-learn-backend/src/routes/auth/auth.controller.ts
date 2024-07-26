import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
<<<<<<< HEAD
import { Request, Response } from 'express';
=======
import { ApiOperation, ApiTags } from '@nestjs/swagger';
>>>>>>> b1dd59a (updates on api versioning)

@ApiTags('Authentication')
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/auth/login
@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
<<<<<<< HEAD
  async login(@Req() req: Request, @Res() res: Response) {
    return this.authService.login(req?.user, res);
=======
  @ApiOperation({ summary: 'User Login' })
  async login(@Request() req: any) {
    return this.authService.login(req.user);
>>>>>>> b1dd59a (updates on api versioning)
  }

  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
