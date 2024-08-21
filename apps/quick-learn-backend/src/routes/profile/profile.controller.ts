import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
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
    return new SuccessResponse("Sucessfully got user's profile data", {
      firstName: user.first_name,
      lastName: user.last_name,
      profileImage:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    });
  }

  @Post()
  @ApiOperation({ summary: 'Set the profile values for the current user' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.profileService.updateUserProfile(user, updateProfileDto);
  }

  @Post('/change-password')
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
