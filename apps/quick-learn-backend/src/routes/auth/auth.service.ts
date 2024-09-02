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
import crypto from 'crypto';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetTokenEntity } from '@src/entities/reset-token.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { SuccessResponse } from '@src/common/dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@src/common/modules/email/email.service';
import { emailSubjects } from '@src/common/constants/email-subject';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { SessionService } from './session.service';
import { SessionEntity } from '@src/entities';
import { LoginDto } from './dto';
import { ITokenData } from '@src/common/interfaces';
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
    private sessionService: SessionService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
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

  async login(loginDto: LoginDto): Promise<ITokenData> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const refreshTokenExpiresIn = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );

    const refreshTokenExpires = ms(refreshTokenExpiresIn);

    const session = await this.sessionService.create({
      user,
      hash,
      expires: `${Date.now() + refreshTokenExpires}`,
    });

    return await this.getTokensData({
      id: user.id,
      role: user.user_type_id,
      sessionId: session.id,
      hash,
    });
  }

  async logout(token: string): Promise<void> {
    const session = await this.jwtService.decode(token);
    if (session) {
      const data = await this.sessionService.get({ id: session.sessionId });
      if (data) {
        await this.sessionService.delete({ id: data.id });
      }
    }
    return;
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

  async refreshToken(
    session: SessionEntity,
  ): Promise<{ token: string; expires: number }> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = ms(tokenExpiresIn);
    const token = await this.jwtService.signAsync(
      {
        id: session.user.id,
        role: session.user.user_type_id,
        sessionId: session.id,
      },
      {
        secret: this.configService.getOrThrow('auth.secret', { infer: true }),
        expiresIn: Date.now() + tokenExpiresIn,
      },
    );

    return {
      token,
      expires: tokenExpires,
    };
  }

  private async getTokensData(data: {
    id: UserEntity['id'];
    role: UserEntity['user_type_id'];
    sessionId: SessionEntity['id'];
    hash: SessionEntity['hash'];
    rememberMe?: boolean;
  }): Promise<ITokenData> {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = ms(tokenExpiresIn);

    const refreshTokenExpiresIn = this.configService.getOrThrow(
      'auth.refreshExpires',
      {
        infer: true,
      },
    );

    const refreshTokenExpires = ms(refreshTokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: Date.now() + tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: Date.now() + refreshTokenExpires,
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
