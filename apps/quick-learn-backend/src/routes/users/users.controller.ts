import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SuccessResponse } from '@src/common/dto';

// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/users
@ApiTags('Users')
@Controller({
  version: '1',
  path: 'users',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto): Promise<SuccessResponse> {
    const user = await this.usersService.create(createUserDto);
    return new SuccessResponse('Successfully created user.', user);
  }

  @Post('list')
  @ApiOperation({ summary: 'Get all users' })
  async findAll(@Body() paginationDto: PaginationDto): Promise<SuccessResponse> {
    const users = await this.usersService.findAll(paginationDto);
    return new SuccessResponse('Successfully got users.', users);
  }

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
