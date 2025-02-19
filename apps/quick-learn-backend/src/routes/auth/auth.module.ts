import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetTokenEntity } from '@src/entities/reset-token.entity';
import { EmailModule } from '@src/common/modules';
import { JwtStrategy, LocalStrategy } from './strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionEntity } from '@src/entities/session.entity';
import { SessionService } from './session.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ResetTokenService } from './reset-token.service';

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secret'),
        signOptions: {
          expiresIn: `${configService.getOrThrow('auth.expires')}`,
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ResetTokenEntity, SessionEntity]),
    EmailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    SessionService,
    ResetTokenService,
  ],
  exports: [SessionService, ResetTokenService],
})
export class AuthModule {}
