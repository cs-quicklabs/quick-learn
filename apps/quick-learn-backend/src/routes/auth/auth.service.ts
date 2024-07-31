import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/entities/user.entity';
import * as bcrypt from 'bcryptjs';

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
    const user = await this.usersService.findOne({ email, active: true });

    // Comparing password
    const isVerified = await bcrypt.compare(password, user.password);
    if (isVerified) {
      await this.usersService.update(user.uuid, {
        last_login_timestamp: new Date(),
      });
      return user;
    } else {
      throw new ForbiddenException('Unauthorized Credentials!');
    }
  }

  async login(user: Partial<UserEntity>): Promise<{ access_token: string }> {
    const payload = { email: user.email, uuid: user.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout() {
    return {
      access_token: '',
    };
  }

  forgotPassword() {
    return 'forgot password';
  }

  resetPassword() {
    return 'reset password';
  }
}
