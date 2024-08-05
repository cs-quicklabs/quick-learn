import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/profile
@Controller({
  version: '1',
  path: 'profile',
})
export class ProfileController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'checking the profile protected route.' })
  profile() {
    return { message: 'I am a protected route' };
  }
}
