import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '@src/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SuccessResponse } from '@src/common/dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { en } from '@src/lang/en';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async updateUserProfile(user: UserEntity, newDetails: UpdateProfileDto) {
    await this.usersService.updateUser(user.id, newDetails, true, user.team_id);
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
      throw new BadRequestException(en.invalidOldPassword);
    }
    await this.usersService.updateUser(user.id, {
      password: await bcrypt.hash(changePasswordDTO.newPassword, 10),
    });
    return new SuccessResponse(en.successdullyPasswordUpdated);
  }

  getPreferencesService(user: UserEntity) {
    return new SuccessResponse(en.successPreferences, {
      preference: user.email_alert_preference,
    });
  }
  async changePreferencesService(user: UserEntity, preference: boolean) {
    await this.usersService.updateUser(user.id, {
      email_alert_preference: preference,
    });
    return new SuccessResponse(en.successPreferencesUpdated, {
      prefernce: user.email_alert_preference,
    });
  }
}
