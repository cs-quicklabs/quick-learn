import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOne({ email });

    // TODO: remove this after implementation of verification
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async login(user: Partial<UserEntity>): Promise<{ access_token: string }> {
    const payload = { email: user.email, password: user.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
