import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { SuccessResponse } from '@src/common/dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import {
  CreateUserDto,
  ListFilterDto,
  PaginationDto,
  UpdateUserDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { en } from '@src/lang/en';
import { AssignRoadmapsToUserDto } from './dto/assign-roadmap.dto';
import { GetUserQueryDto } from './dto/get-user-query.dto';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/users
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('metadata')
  @ApiOperation({ summary: 'Metadata for the add/update user(s).' })
  async metadata(@CurrentUser() user: UserEntity): Promise<SuccessResponse> {
    const metadata = await this.usersService.getMetadata(user);
    return new SuccessResponse(`Successfully got user's metadata.`, metadata);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(
    @CurrentUser() loggedInUser: UserEntity,
    @Body() createUserDto: CreateUserDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.create({
      ...createUserDto,
      team_id: loggedInUser.team_id,
    });
    return new SuccessResponse(en.successUserCreate, user);
  }

  @Post('list')
  @ApiOperation({ summary: 'Filter users' })
  async findAll(
    @CurrentUser() user: UserEntity,
    @Body() paginationDto: PaginationDto,
    @Query() filter: ListFilterDto,
  ): Promise<SuccessResponse> {
    const users = await this.usersService.findAll(user, paginationDto, filter);
    return new SuccessResponse('Successfully got users.', users);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get specific user by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async findOne(
    @Param('uuid') uuid: string,
    @Query() getUserQueryDto: GetUserQueryDto,
  ): Promise<SuccessResponse> {
    const relations = [];
    if (getUserQueryDto.is_load_assigned_roadmaps) {
      relations.push('assigned_roadmaps');
    }
    if (getUserQueryDto.is_load_assigned_courses) {
      relations.push('assigned_roadmaps.courses');
    }
    const user = await this.usersService.findOne({ uuid }, relations);
    return new SuccessResponse('Successfully got users.', user);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update specific user by  uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.updateUser(uuid, updateUserDto);
    return new SuccessResponse('Successfully updated user.', user);
  }

  @Patch(':uuid/assign-roadmaps')
  @ApiOperation({ summary: 'Assign roadmaps to user' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async assignRoadmaps(
    @Param('uuid') uuid: string,
    @Body() assignRoadmapsToUserDto: AssignRoadmapsToUserDto,
  ): Promise<SuccessResponse> {
    await this.usersService.assignRoadmaps(uuid, assignRoadmapsToUserDto);
    return new SuccessResponse(en.successUserUpdated);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete specific user by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async remove(@Param('uuid') uuid: string) {
    await this.usersService.remove(uuid);
    return new SuccessResponse('Successfully deleted user.');
  }
}
