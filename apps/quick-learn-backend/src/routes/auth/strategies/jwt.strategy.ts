import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../session.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private sessionService: SessionService,
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
    });
  }

  async validate(payload: { id: number; role: number; sessionId: number }) {
    console.log('payload', payload);
    const session = await this.sessionService.get({
      id: payload.sessionId,
      user: { id: payload.id, user_type_id: payload.role },
    });
    if (!session) {
      throw new UnauthorizedException();
    }
    return session.user;
  }
}
