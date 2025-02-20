import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetTokenEntity } from '@src/entities/reset-token.entity';
import { EmailModule, SessionModule } from '@src/common/modules';
import { JwtStrategy, LocalStrategy } from './strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SessionEntity } from '@src/entities/session.entity';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ResetTokenService } from './reset-token.service';

@Module({
  controllers: [AuthController],
  imports: [
    TypeOrmModule.forFeature([ResetTokenEntity, SessionEntity]),
    forwardRef(() => UsersModule),
    PassportModule,
    EmailModule,
    SessionModule,
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
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    ResetTokenService,
  ],
  exports: [ResetTokenService, AuthService],
})
export class AuthModule {}
