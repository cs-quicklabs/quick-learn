import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SuccessResponse } from '@src/common/dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async updateUserProfile(user: UserEntity, newDetails: UpdateProfileDto) {
    await this.usersService.updateUser(user.uuid, newDetails, true);
    return new SuccessResponse('Profile updated successfully');
  }

  async changePasswordService(
    user: UserEntity,
    changePasswordDTO: ChangePasswordDTO,
  ) {
    const arePasswordsSame = await bcrypt.compare(
      changePasswordDTO.oldPassword,
      user.password,
    );
    if (!arePasswordsSame) {
      throw new UnauthorizedException('Invalid Old Password');
    }
    await this.usersService.updateUser(
      user.uuid,
      {
        password: await bcrypt.hash(changePasswordDTO.newPassword, 10),
      },
      false,
    );
    return new SuccessResponse('Password updated successfully');
  }

  getPreferencesService(user: UserEntity) {
    return new SuccessResponse('Fetched preferences successfully', {
      preference: user.email_alert_preference,
    });
  }
  async changePreferencesService(user: UserEntity, preference: boolean) {
    await this.usersService.updateUser(
      user.uuid,
      {
        email_alert_preference: preference,
      },
      false,
    );
    return new SuccessResponse('Email preference updated successfully', {
      prefernce: user.email_alert_preference,
    });
  }
}
