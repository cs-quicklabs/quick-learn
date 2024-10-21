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
    const users = await this.usersService.findAll(user, paginationDto, {
      ...filter,
      active: true,
    });
    return new SuccessResponse('Successfully got users.', users);
  }

  @Post('archived')
  @ApiOperation({ summary: 'Get Archived Users' })
  async findAllArchivedUser(
    @CurrentUser() user: UserEntity,
    @Body() paginationDto: PaginationDto,
    @Query() filter: ListFilterDto,
  ): Promise<SuccessResponse> {
    const users = await this.usersService.findAll(user, paginationDto, {
      ...filter,
      active: false,
    });
    return new SuccessResponse('Successfully got users.', users);
  }

  @Post('activate')
  @ApiOperation({ summary: 'Activate or archive user' })
  async activateUser(
    @Body() body: { uuid: string; active: boolean },
  ): Promise<SuccessResponse> {
    const { active, uuid } = body; // Destructure the active property from the request body
    const updatedUser = await this.usersService.update({ uuid }, { active });
    return new SuccessResponse(
      'User status updated successfully.',
      updatedUser,
    );
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get specific user by uuid' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async findOne(@Param('uuid') uuid: string): Promise<SuccessResponse> {
    const user = await this.usersService.findOne({ uuid });
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
    @CurrentUser() currentUser: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.updateUser(uuid, {
      ...updateUserDto,
      updated_by: currentUser,
    });
    return new SuccessResponse('Successfully updated user.', user);
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
