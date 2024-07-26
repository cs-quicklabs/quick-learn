import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

<<<<<<< HEAD
  async validate(
    email: string,
    password: string,
    rememberMe: boolean,
  ): Promise<any> {
    const user = await this.authService.validateUser(
      email,
      password,
      rememberMe,
    );
=======
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
