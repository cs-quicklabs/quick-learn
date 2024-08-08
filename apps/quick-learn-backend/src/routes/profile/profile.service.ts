import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SuccessResponse } from '@src/common/dto';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async updateUserProfile(user: UserEntity, newDetails: UpdateProfileDto) {
    await this.usersService.update(user.uuid, {
      first_name: newDetails.firstName,
      last_name: newDetails.lastName,
    });
    return new SuccessResponse('Profile updated successfully', {});
  }
}
