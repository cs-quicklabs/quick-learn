import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/config/config.type';
import { Request } from 'express';
import { SessionService } from '../session.service';
import Helpers from '@src/common/utils/helper';

type JwtRefreshPayloadType = {
  sessionId: number;
  hash: string;
  iat: number;
  exp: number;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly sessionService: SessionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['refresh_token'];
        },
      ]),
      secretOrKey: configService.get('auth.refreshSecret', { infer: true }),
      passReqToCallback: true,
    });
  }

  public async validate(req: Request, payload: JwtRefreshPayloadType) {
    try {
      const session = await this.sessionService.get({
        id: payload.sessionId,
        hash: payload.hash,
        user: { active: true },
      });

      if (!session) {
        Helpers.clearCookies(req.res);
        throw new UnauthorizedException('Invalid session');
      }

      // Check if token is expired
      if (Number(session.expires) < Date.now()) {
        Helpers.clearCookies(req.res);
        throw new UnauthorizedException('Refresh token expired');
      }

      return session;
    } catch (error) {
      Helpers.clearCookies(req.res);
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
