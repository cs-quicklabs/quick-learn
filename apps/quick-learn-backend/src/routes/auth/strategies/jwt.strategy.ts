import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '@src/routes/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwtSecretkey'),
    });
  }

  async validate(payload: { sub: string; email: string; uuid: string }) {
    const users = await this.usersService.findByEmailOrUUID(
      payload.email,
      payload.uuid,
    );
    if (users.length === 1) {
      return users[0];
    }
    return null;
  }
}
