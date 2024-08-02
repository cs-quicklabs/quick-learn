import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetTokenEntity } from '@src/entities/reset_token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(ResetTokenEntity)
    private resetTokenRepository: Repository<ResetTokenEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOne({ email, active: true });
    if (!user) {
      throw new ForbiddenException('No User Found!');
    }

    // Comparing password
    const isVerified = await bcrypt.compare(password, user.password);
    if (isVerified) {
      await this.usersService.update(user.uuid, {
        last_login_timestamp: new Date(),
      });
      return user;
    } else {
      throw new ForbiddenException('Wrong Credentials!');
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

  async forgotPassword(email: string) {
    //Check that user exists
    const user = await this.usersService.findOne({ email, active: true });

    if (user) {
      // If user exists, generate password reset link (with token) and save token in the db

      const resetToken = nanoid(64);

      await this.resetTokenRepository.save({
        token: resetToken,
        user_id: user.uuid,
      });

      // TODO: send the link to the user by email with token

      // FIXME: send email using sendgrid > as of now generate token and show in response

      const resetURL = resetToken;

      return resetURL;
    }

    return { message: 'If this user exists, they will recieve an email' };
  }

  // TODO: reset password > get token from email, decode token, update password & delete token from db
  async resetPassword(resetToken: string, newPassword: string) {
    // find a valid reset token
    const token = await this.resetTokenRepository.findOne({
      where: { token: resetToken, active: true },
    });
    await this.resetTokenRepository.delete({
      token: resetToken,
      active: true,
    });
    if (!token) {
      throw new UnauthorizedException('Invalid Link');
    }
    // change user password
    const user = await this.usersService.findOne({ uuid: token.user_id });

    if (!user) {
      throw new InternalServerErrorException();
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.create({
      password: user.password,
    });
    await this.userRepository.save(user);
    return { message: 'Password updated successfully' };
  }
}
