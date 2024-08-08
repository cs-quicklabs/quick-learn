import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { SuccessResponse } from '@src/common/dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/profile
@Controller({
  version: '1',
  path: 'profile',
})
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Set the profile values for the current user' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.profileService.updateUserProfile(user, updateProfileDto);
  }
}
