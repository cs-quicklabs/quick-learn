import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

<<<<<<< HEAD
@Controller('users')
=======
@ApiTags('Users')
// using the global prefix from main file (api) and putting versioning here as v1 /api/v1/users
@Controller({
  version: '1',
  path: 'users',
})
>>>>>>> 1699416 (PR #7 review resolve & updated api endpoints)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific user by user id' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specific user by user id' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete specific user by user id' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
