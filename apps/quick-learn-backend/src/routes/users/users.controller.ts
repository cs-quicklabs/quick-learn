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
import { GetLessonByIdQueryDto } from './dto/get-lesson-by-id.dto';
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

  @Get('my-roadmaps/:id/:userId?')
  @ApiOperation({ summary: "Get current user's roadmap by id" })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Get the roadmap by id',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    type: Number, // Aligning with the actual type in the route
    description: 'Optional user ID',
  })
  async getCurrentUserRoadmapsById(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Param('userId') userId?: number,
    // @Param('userid') userid?: number | undefined,
  ): Promise<SuccessResponse> {
    // if (!userid) userid = user?.id;
    const roadmaps = await this.usersService.getRoadmapDetails(
      userId ? userId : user?.id,
      +id,
    );
    return new SuccessResponse(en.successGotUserRoadmapDetail, roadmaps);
  }

  @Get('myroadmaps/courses/:id/:userId?')
  @ApiOperation({ summary: "Get current user's course by id" })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Get the course by id',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    type: Number, // Aligning with the actual type in the route
    description: 'Optional user ID',
  })
  async getCurrentUserCoursesById(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Query('roadmapId') roadmapId?: string,
    @Param('userId') userId?: number,
  ): Promise<SuccessResponse> {
    const roadmaps = await this.usersService.getCourseDetails(
      userId ? userId : user?.id,
      +id,
      roadmapId ? +roadmapId : undefined,
    );
    return new SuccessResponse(en.successGotUserRoadmapDetail, roadmaps);
  }

  @Get('myroadmaps/lessons/:id/:userId?')
  @ApiOperation({ summary: "Get current user's lesson by id" })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Get the lesson by id',
  })
  @ApiParam({
    name: 'userId',
    required: false,
    type: Number, // Aligning with the actual type in the route
    description: 'Optional user ID',
  })
  async getCurrentUserLessonsById(
    @CurrentUser() user: UserEntity,
    @Param('id') id: string,
    @Query() query: GetLessonByIdQueryDto,
    @Param('userId') userId?: number,
  ): Promise<SuccessResponse> {
    const roadmaps = await this.usersService.getLessonDetails(
      userId ? userId : user?.id,
      +id,
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
    console.log('query= ', query);
    const searchedQueryResult = await this.usersService.getUserSearchedQuery(
      user.id,
      query,
    );

    return new SuccessResponse(
      'Here are you Search results',
      searchedQueryResult,
    );
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
