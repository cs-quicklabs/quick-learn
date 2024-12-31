import {
  BadRequestException,
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
import { en } from '@src/lang/en';

interface IRefreshTokenPayload {
  sessionId: number;
  hash: string;
}

interface IAccessTokenPayload {
  id: number;
  role: number;
  sessionId: number;
}

@Injectable()
export class AuthService {
  private accessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;
  private refreshTokenRememberMeExpiresIn: number;
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
  ) {
    this.accessTokenExpiresIn =
      this.getTokenExpiresInMilliSeconds('auth.expires');
    this.refreshTokenExpiresIn = this.getTokenExpiresInMilliSeconds(
      'auth.refreshExpires',
    );
    this.refreshTokenRememberMeExpiresIn = this.getTokenExpiresInMilliSeconds(
      'auth.refreshRememberMeExpires',
    );
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new ForbiddenException(en.userLinkedToEmail);
    }

    if (!user.active) {
      throw new ForbiddenException(en.accountDeactiveMessage);
    }

    // Comparing password
    const isVerified = await bcrypt.compare(password, user.password);
    if (isVerified) {
      await this.usersService.updateUser(user.id, {
        last_login_timestamp: new Date(),
      });
      return user;
    } else {
      throw new ForbiddenException(en.wrongCredentials);
    }
  }

  async login(loginDto: LoginDto): Promise<ITokenData> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const refreshTokenExpires = ms(
      loginDto.rememberMe
        ? this.refreshTokenRememberMeExpiresIn
        : this.refreshTokenExpiresIn,
    );

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
      rememberMe: loginDto.rememberMe,
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
  }

  async forgotPassword(email: string) {
    const checkUserExists = await this.usersService.findOne({
      email,
      active: true,
    });

    if (checkUserExists) {
      // If user exists, generate password reset link (with token) and save token in the db

      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getMinutes() + 15);
      const generateResetToken = nanoid(64);

      await this.resetTokenRepository.save({
        token: generateResetToken,
        user_id: checkUserExists.uuid,
        expiry_date: expiryDate,
      });

      const frontendURL = this.configService.get('app.frontendDomain', {
        infer: true,
      });
      const resetURL = `${frontendURL}/reset-password?token=${generateResetToken}`;

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
    const findValidToken = await this.resetTokenRepository.findOne({
      where: {
        token: resetToken,
        active: true,
        expiry_date: MoreThan(new Date()),
      },
    });

    if (!findValidToken) {
      throw new UnauthorizedException('Invalid Link');
    }

    // change user password
    // Todo: uuid should be used as a foreign key. uuid is generated column not primary key
    const user = await this.usersService.findOne({
      uuid: findValidToken.user_id,
    });

    if (!user) {
      throw new InternalServerErrorException();
    }

    const validateNewOldPassword = await bcrypt.compare(
      newPassword,
      user.password,
    );
    if (validateNewOldPassword) {
      throw new BadRequestException(en.usingsamePassword);
    }

    // TODO: delete expired tokens using cronjobs
    await this.resetTokenRepository.delete({
      token: resetToken,
      active: true,
    });

    // TODO: delete expired tokens using cronjobs
    await this.resetTokenRepository.delete({
      expiry_date: LessThan(new Date()),
    });

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
    const token = await this.generateToken(
      {
        id: session.user.id,
        role: session.user.user_type_id,
        sessionId: session.id,
      },
      'auth.secret',
      this.accessTokenExpiresIn,
    );

    await this.userRepository.update(
      { id: session.user.id },
      { last_login_timestamp: new Date() },
    );

    return {
      token,
      expires: this.accessTokenExpiresIn,
    };
  }

  private async getTokensData(data: {
    id: UserEntity['id'];
    role: UserEntity['user_type_id'];
    sessionId: SessionEntity['id'];
    hash: SessionEntity['hash'];
    rememberMe?: boolean;
  }): Promise<ITokenData> {
    const expires = data.rememberMe
      ? this.refreshTokenRememberMeExpiresIn
      : this.refreshTokenExpiresIn;
    const [token, refreshToken] = await Promise.all([
      await this.generateToken(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        'auth.secret',
        this.accessTokenExpiresIn,
      ),
      await this.generateToken(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        'auth.refreshSecret',
        expires,
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires: this.accessTokenExpiresIn,
      role: data.role,
    };
  }

  private getTokenExpiresInMilliSeconds(configKey: string): number {
    const tokenExpiresIn = this.configService.getOrThrow<string>(configKey, {
      infer: true,
    });
    return ms(tokenExpiresIn);
  }

  private async generateToken(
    payload: IRefreshTokenPayload | IAccessTokenPayload,
    secretConfigKey: string,
    expiresIn: number,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow(secretConfigKey, { infer: true }),
      expiresIn: Date.now() + expiresIn,
    });
  }
}
