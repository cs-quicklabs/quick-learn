import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '@src/config/config.type';
import { Request } from 'express';
import { SessionService } from '../session.service';

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
    });
  }

  public async validate(payload: JwtRefreshPayloadType) {
    const session = await this.sessionService.get({
      id: payload.sessionId,
      hash: payload.hash,
    });
    if (!session) {
      throw new UnauthorizedException();
    }
    return session;
  }
}
