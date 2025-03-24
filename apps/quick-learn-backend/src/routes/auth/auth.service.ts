import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MoreThan } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@src/entities/user.entity';
import ms from 'ms';

import { UsersService } from '../users/users.service';
import { SuccessResponse } from '@src/common/dto';
import { EmailService } from '@src/common/modules/email/email.service';
import { emailSubjects } from '@src/common/constants/email-subject';
import { SessionEntity } from '@src/entities';
import { LoginDto } from './dto';
import { IDailyLessonTokenData, ITokenData } from '@src/common/interfaces';
import { en } from '@src/lang/en';
import Helpers from '@src/common/utils/helper';
import { ResetTokenService } from './reset-token.service';
import { SessionService } from '@src/common/modules/session/session.service';

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
  private authSecret: string;
  private authRefreshSecret: string;
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly resetTokenService: ResetTokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
  ) {
    this.accessTokenExpiresIn =
      this.getTokenExpiresInMilliSeconds('auth.expires');
    this.refreshTokenExpiresIn = this.getTokenExpiresInMilliSeconds(
      'auth.refreshExpires',
    );
    this.refreshTokenRememberMeExpiresIn = this.getTokenExpiresInMilliSeconds(
      'auth.refreshRememberMeExpires',
    );
    this.authSecret = this.configService.getOrThrow<string>('auth.secret', {
      infer: true,
    });
    this.authRefreshSecret = this.configService.getOrThrow<string>(
      'auth.refreshSecret',
      { infer: true },
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
    const isVerified = await this.usersService.comparePassword(
      password,
      user.password,
    );
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

    const hash = Helpers.generateRandomhash();

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
      const generateResetToken = Helpers.generateRandomhash();

      await this.resetTokenService.create({
        token: generateResetToken,
        user_id: checkUserExists.id,
        expiry_date: expiryDate,
      });

      const frontendURL = this.configService.get('app.frontendDomain', {
        infer: true,
      });
      const resetURL = `${frontendURL}/reset-password?token=${generateResetToken}`;
      return this.emailService.forgetPasswordEmail(resetURL, email);
    }
    return new SuccessResponse(
      'If this user exists, they will recieve an email',
    );
  }

  // TODO: reset password > get token from email, decode token, update password & delete token from db
  async resetPassword(resetToken: string, newPassword: string) {
    const findValidToken = await this.resetTokenService.get({
      token: resetToken,
      active: true,
      expiry_date: MoreThan(new Date()),
    });

    if (!findValidToken) {
      throw new UnauthorizedException('Invalid Link');
    }

    // change user password
    const user = await this.usersService.findOne({
      id: findValidToken.user_id,
    });

    if (!user) {
      throw new InternalServerErrorException();
    }

    const validateNewOldPassword = await this.usersService.comparePassword(
      newPassword,
      user.password,
    );
    if (validateNewOldPassword) {
      throw new BadRequestException(en.usingsamePassword);
    }

    await this.resetTokenService.update(
      {
        token: findValidToken.token,
        id: findValidToken.id,
      },
      {
        active: false,
      },
    );

    user.password = await this.usersService.hashPassword(newPassword);
    await this.usersService.save(user);

    const emailData = {
      body: '<p>Your password has been reset successfully.</p>',
      recipients: [user.email],
      subject: emailSubjects.resetPasswordSuccess,
    };

    this.emailService.notify(emailData);

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
      this.authSecret,
      this.accessTokenExpiresIn,
    );

    await this.usersService.update(
      { id: session.user.id },
      { last_login_timestamp: new Date() },
    );

    return {
      token,
      expires: this.accessTokenExpiresIn,
    };
  }

  getTokenDetails(
    token: string,
  ): IRefreshTokenPayload | IAccessTokenPayload | IDailyLessonTokenData {
    return this.jwtService.decode(token);
  }

  generateDailyLessonToken(payload: IDailyLessonTokenData): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.authSecret,
    });
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
        this.authSecret,
        this.accessTokenExpiresIn,
      ),
      await this.generateToken(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        this.authRefreshSecret,
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
      secret: secretConfigKey,
      expiresIn: Date.now() + expiresIn,
    });
  }
}
