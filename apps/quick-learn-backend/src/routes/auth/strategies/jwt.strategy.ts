import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import Helpers from '@src/common/utils/helper';
import { en } from '@src/lang/en';
import { SessionService } from '@src/common/modules/session/session.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly sessionService: SessionService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { id: number; role: number; sessionId: number },
  ) {
    const session = await this.sessionService.get({
      id: payload.sessionId,
      user: { id: payload.id, user_type_id: payload.role, active: true },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    // Check if token is expired
    if (Number(session.expires) < Date.now()) {
      Helpers.clearCookies(req.res);
      throw new UnauthorizedException(en.refreshTokenExpired);
    }

    return session.user;
  }
}
