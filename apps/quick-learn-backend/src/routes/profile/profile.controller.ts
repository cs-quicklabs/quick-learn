import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { SuccessResponse } from '@src/common/dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';
import { profilePreferencesDTO } from './dto/profile-preferences.dto';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Profile')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'profile',
})
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'checking the profile protected route.' })
  getProfile(@CurrentUser() user: UserEntity) {
    const { first_name, last_name, profile_image, email } = user;
    return new SuccessResponse("Successfully got user's profile data", {
      first_name,
      last_name,
      profile_image,
      email,
    });
  }

  @Patch()
  @ApiOperation({ summary: 'Set the profile values for the current user' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.profileService.updateUserProfile(user, updateProfileDto);
  }

  @Patch('/change-password')
  @ApiOperation({ summary: 'Change the password for the current user' })
  async changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @CurrentUser() user: UserEntity,
  ) {
    return this.profileService.changePasswordService(user, changePasswordDTO);
  }

  @Get('/user-preferences')
  @ApiOperation({ summary: 'Get the profile preferences for the current user' })
  async getPreferences(@CurrentUser() user: UserEntity) {
    return this.profileService.getPreferencesService(user);
  }

  @Patch('/user-preferences')
  @ApiOperation({
    summary: 'Update the profile preferences for the current user',
  })
  async changePreferences(
    @CurrentUser() user: UserEntity,
    @Body() profilePreferencesDTO: profilePreferencesDTO,
  ) {
    return this.profileService.changePreferencesService(
      user,
      profilePreferencesDTO.preference,
    );
  }
}
