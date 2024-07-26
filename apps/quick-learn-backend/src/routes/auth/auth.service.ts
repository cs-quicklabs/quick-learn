<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
=======
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

<<<<<<< HEAD
  async validateUser(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<any> {
    const user = await this.usersService.findbyEmail(email);
    rememberMe && console.log('rememberme:', rememberMe);
=======
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findbyEmail(email);

>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

<<<<<<< HEAD
  async login(user: any, response: Response) {
    console.log(user);
    const payload = { email: user.email, password: user.password };
    const jwtToken = this.jwtService.sign(payload);
    response.cookie('accessToken', jwtToken, { httpOnly: true, secure: true });
    return jwtToken;
=======
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)
  }
}
