import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<any> {
    const user = await this.usersService.findbyEmail(email);
    rememberMe && console.log('rememberme:', rememberMe);
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, response: Response) {
    console.log(user);
    const payload = { email: user.email, password: user.password };
    const jwtToken = this.jwtService.sign(payload);
    response.cookie('accessToken', jwtToken, { httpOnly: true, secure: true });
    return jwtToken;
  }
}
