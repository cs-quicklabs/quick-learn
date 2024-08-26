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
import { ResetTokenEntity } from '@src/entities/reset-token.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { SuccessResponse } from '@src/common/dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@src/common/modules/email/email.service';
import { emailSubjects } from '@src/common/constants/email-subject';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(ResetTokenEntity)
    private resetTokenRepository: Repository<ResetTokenEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
    private emailService: EmailService,
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

      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 15);
      const resetToken = nanoid(64);

      await this.resetTokenRepository.save({
        token: resetToken,
        user_id: user.uuid,
        expiry_date: expiryDate,
      });

      const frontendURL = this.configService.get('app.frontendDomain', {
        infer: true,
      });
      const resetURL = `${frontendURL}/reset-password?token=${resetToken}`;

      const html = `<div>
        <p>Please click on the link below to reset your password.</p><br/>
        <a style="padding: 8px 16px;text-decoration: none;background-color: #10182a;border-radius: 4px;color: white;" target="_blank" href="${resetURL}">Reset Password</a><br/>
      <div>`;

      this.emailService.email({
        body: html,
        recipients: [email],
        subject: emailSubjects.resetPassword,
      });

      return new SuccessResponse('Reset password link has been shared.');
    }
    return new SuccessResponse(
      'If this user exists, they will recieve an email',
    );
  }

  // TODO: reset password > get token from email, decode token, update password & delete token from db
  async resetPassword(resetToken: string, newPassword: string) {
    // find a valid reset token
    const token = await this.resetTokenRepository.findOne({
      where: {
        token: resetToken,
        active: true,
        expiry_date: MoreThan(new Date()),
      },
    });

    // TODO: delete expired tokens using cronjobs
    await this.resetTokenRepository.delete({
      token: resetToken,
      active: true,
    });

    // TODO: delete expired tokens using cronjobs
    await this.resetTokenRepository.delete({
      expiry_date: LessThan(new Date()),
    });

    if (!token) {
      throw new UnauthorizedException('Invalid Link');
    }

    // change user password
    // Todo: uuid should be used as a foreign key. uuid is generated column not primary key
    const user = await this.usersService.findOne({ uuid: token.user_id });

    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcrypt.hash(newPassword, 10);
    // Todo: update the below to use update function rather than save method
    await this.userRepository.create({
      password: user.password,
    });
    await this.userRepository.save(user);

    const emailData = {
      body: '<p>Your password has been reset successfully.</p>',
      recipients: [user.email],
      subject: emailSubjects.resetPasswordSuccess,
    };

    this.emailService.email(emailData);

    return new SuccessResponse('Password updated successfully');
  }
}
