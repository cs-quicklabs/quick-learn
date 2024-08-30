import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { SessionService } from '../session.service';
import Helpers from '@src/common/utils/helper';

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
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: { id: number; role: number; sessionId: number },
  ) {
    const session = await this.sessionService.get({
      id: payload.sessionId,
      user: { id: payload.id, user_type_id: payload.role },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    // Check if token is expired
    if (Number(session.expires) < Date.now()) {
      Helpers.clearCookies(req.res);
      throw new UnauthorizedException('Refresh token expired');
    }

    return session.user;
  }
}
