import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetTokenEntity } from '@src/entities/reset_token.entity';
import { UserEntity } from '@src/entities/user.entity';
import { EmailModule } from '@src/common/modules';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forFeature([ResetTokenEntity, UserEntity]),
    EmailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
