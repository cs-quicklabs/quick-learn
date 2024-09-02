import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  imports: [UsersModule],
})
export class ProfileModule {}
