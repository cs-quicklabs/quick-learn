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
import { GetLessonByIdQueryDto } from './dto/get-lesson-by-id.dto';
import { userParamsDto } from './dto/user-params.dto';
import { userIdParamsDto } from './dto/userId-params.dto';
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

  @Get('my-roadmaps')
  @ApiOperation({ summary: "Get current user's assigned roadmaps" })
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

  @Get('my-roadmaps/:id/:userId?')
  @ApiOperation({ summary: "Get current user's roadmap by id" })
  async getCurrentUserRoadmapsById(
    @CurrentUser() user: UserEntity,
    @Param() params:userParamsDto,
    
  ): Promise<SuccessResponse> {
    const roadmaps = await this.usersService.getRoadmapDetails(
      !isNaN(+params.userId) ? +params.userId : user.id,
      +params.id,
    );
    return new SuccessResponse(en.successGotUserRoadmapDetail, roadmaps);
  }

  @Get('myroadmaps/courses/:id/:userId?')
  @ApiOperation({ summary: "Get current user's course by id" })
  async getCurrentUserCoursesById(
    @CurrentUser() user: UserEntity,
    @Param() params:userParamsDto,
    @Query('roadmapId') roadmapId?: string,
    
  ): Promise<SuccessResponse> {
    const roadmaps = await this.usersService.getCourseDetails(
      !isNaN(+params.userId) ? +params.userId : user.id,
      +params.id,
      roadmapId ? +roadmapId : undefined,
    );
    return new SuccessResponse(en.successGotUserRoadmapDetail, roadmaps);
  }

  @Get('myroadmaps/lessons/:id/:userId?')
  @ApiOperation({ summary: "Get current user's lesson by id" })
  async getCurrentUserLessonsById(
    @CurrentUser() user: UserEntity,
    @Query() query: GetLessonByIdQueryDto,
    @Param() params:userParamsDto,
  ): Promise<SuccessResponse> {
    const roadmaps = await this.usersService.getLessonDetails(
      !isNaN(+params.userId) ? +params.userId : user.id,
      +params.id,
      +query.courseId,
      query.roadmapId ? +query.roadmapId : undefined,
    );
    return new SuccessResponse(en.successGotUserRoadmapDetail, roadmaps);
  }

  @Get('search')
  @ApiOperation({ summary: 'Get search queries' })
  async getSearchQuery(
    @CurrentUser() user: UserEntity,
    @Query('query') query: string,
  ): Promise<SuccessResponse> {
    const searchedQueryResult = await this.usersService.getUserSearchedQuery(
      user.user_type_id,
      query,
      user.id,
    );

    return new SuccessResponse(en.searchResults, searchedQueryResult);
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

  @Get('list')
  @ApiOperation({ summary: 'Filter users' })
  async findAll(
    @CurrentUser() user: UserEntity,
    @Query() paginationDto: PaginationDto,
    @Query() filter: ListFilterDto,
  ): Promise<SuccessResponse> {
    const users = await this.usersService.findAll(user, paginationDto, {
      ...filter,
      active: true,
    });
    return new SuccessResponse(en.successGotUsers, users);
  }

  @Get('archived')
  @ApiOperation({ summary: 'Get Archived Users' })
  async findAllInactiveUsers(
    @CurrentUser() user: UserEntity,
    @Query() paginationDto: PaginationDto,
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
      {
        updated_at: 'DESC',
      },
    );
    return new SuccessResponse(en.successGotUsers, users);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate or deactivate user' })
  async activateUser(
    @Body() body: { userId: number; active: boolean },
  ): Promise<SuccessResponse> {
    const { active, userId } = body;
    const updatedUser = await this.usersService.updateUser(userId, { active });
    return new SuccessResponse(en.successUserStatusUpdate, updatedUser);
  }

  // This should come AFTER all the specific routes
  @Get(':id')
  @ApiOperation({ summary: 'Get specific user by uuid' })
   @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
  })
  async findOne(
     @Param('id') userId: number,
    @Query() getUserQueryDto: GetUserQueryDto,
  ): Promise<SuccessResponse> {
    const relations = [];
    if (getUserQueryDto.is_load_assigned_roadmaps) {
      relations.push('assigned_roadmaps');
    }
    if (getUserQueryDto.is_load_assigned_courses) {
      relations.push('assigned_roadmaps.courses');
      relations.push('assigned_roadmaps.courses.lessons');
    }
    const user = await this.usersService.findOneWithSelectedRelationData(
      { id: userId },
      relations,
    );
    return new SuccessResponse(en.successGotUser, user);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Update specific user by userId' })
   @ApiParam({
    name: 'userId',
    type: 'number',
    required: true,
  })
  async update(
   @Param('userId') userId: number,
    @CurrentUser() currentUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.updateUser(userId, {
      ...updateUserDto,
      updated_by: currentUser,
    });
    return new SuccessResponse(en.successUserUpdate, user);
  }

  @Patch(':userId/assign-roadmaps')
  @ApiOperation({ summary: 'Assign roadmaps to user' })
  @ApiParam({
    name: 'userId',
    type: 'number',
    required: true,
  })
  async assignRoadmaps(
    @Param('userId') userId: number,
    @Body() assignRoadmapsToUserDto: AssignRoadmapsToUserDto,
  ): Promise<SuccessResponse> {
    await this.usersService.assignRoadmaps(userId, assignRoadmapsToUserDto);
    return new SuccessResponse(en.successUserUpdated);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Permanently delete user by userId' })
   @ApiParam({
    name: 'userId',
    type: 'number',
    required: true,
  })
  async remove(@Param('userId') userId: number) {
    await this.usersService.delete({ id: userId });
    return new SuccessResponse(en.successUserDelete);
  }
}
