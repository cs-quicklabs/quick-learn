import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SuccessResponse } from '@src/common/dto';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/users
@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('metadata')
  @ApiOperation({ summary: 'Metadata for the add/update user(s).' })
  async metadata(@CurrentUser() user: UserEntity): Promise<SuccessResponse> {
    const metadata = await this.usersService.getMetadata(user);
    return new SuccessResponse(`Successfully got user's metadata.`, metadata);
  }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<SuccessResponse> {
    const user = await this.usersService.create(createUserDto);
    return new SuccessResponse('Successfully created user.', user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('list')
  @ApiOperation({ summary: 'Get all users' })
  async findAll(
    @CurrentUser() user: UserEntity,
    @Body() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const users = await this.usersService.findAll(user, paginationDto);
    return new SuccessResponse('Successfully got users.', users);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':uuid')
  @ApiOperation({ summary: 'Get specific user by user id' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async findOne(@Param('uuid') uuid: string): Promise<SuccessResponse> {
    const user = await this.usersService.findOne({ uuid });
    return new SuccessResponse('Successfully got users.', user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':uuid')
  @ApiOperation({ summary: 'Update specific user by user id' })
  @ApiParam({
    name: 'uuid',
    type: 'string',
    required: true,
  })
  async update(
    @Param('uuid') uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SuccessResponse> {
    const user = await this.usersService.update(uuid, updateUserDto);
    return new SuccessResponse('Successfully updated user.', user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete specific user by user id' })
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
