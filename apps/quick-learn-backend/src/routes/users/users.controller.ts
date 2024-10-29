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
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
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
    return new SuccessResponse(en.successUserMetadata, metadata);
  }

  // Add this route BEFORE the :uuid route
  @Get('my-roadmaps')
  @ApiOperation({ summary: "Get current user's assigned roadmaps" })
  @ApiQuery({
    name: 'include_courses',
    required: false,
    type: Boolean,
    description: 'Include associated courses in the response',
  })
  async getCurrentUserRoadmaps(
    @CurrentUser() user: UserEntity,
    @Query('include_courses') includeCourses?: boolean,
  ): Promise<SuccessResponse> {
    const roadmaps = await this.usersService.getUserRoadmaps(
      user.id,
      includeCourses,
    );
    return new SuccessResponse(en.successGotUserRoadmaps, roadmaps);
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
    const users = await this.usersService.findAll(user, paginationDto, {
      ...filter,
      active: true,
    });
    return new SuccessResponse(en.successGotUsers, users);
  }

  @Post('archived')
  @ApiOperation({ summary: 'Get Archived Users' })
  async findAllInactiveUsers(
    @CurrentUser() user: UserEntity,
    @Body() paginationDto: PaginationDto,
    @Query() filter: ListFilterDto,
  ): Promise<SuccessResponse> {
    const users = await this.usersService.findAll(
      user,
      paginationDto,
      {
        ...filter,
        active: false,
      },
      ['updated_by'],
    );
    return new SuccessResponse(en.successGotUsers, users);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate or deactivate user' })
  async activateUser(
    @Body() body: { uuid: string; active: boolean },
  ): Promise<SuccessResponse> {
    const { active, uuid } = body;
    const updatedUser = await this.usersService.updateUser(uuid, { active });
    return new SuccessResponse(en.successUserStatusUpdate, updatedUser);
  }

  // This should come AFTER all the specific routes
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
    return new SuccessResponse(en.successGotUser, user);
  }

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update specific user by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async update(
    @Param('uuid') uuid: string,
    @CurrentUser() currentUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.updateUser(uuid, {
      ...updateUserDto,
      updated_by: currentUser,
    });
    return new SuccessResponse(en.successUserUpdate, user);
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
  @ApiOperation({ summary: 'Permanently delete user by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async remove(@Param('uuid') uuid: string) {
    await this.usersService.delete({ uuid });
    return new SuccessResponse(en.successUserDelete);
  }
}
