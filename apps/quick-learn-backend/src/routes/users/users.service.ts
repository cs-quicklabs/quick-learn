import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResult } from '@src/common/interfaces/paginate.interface';
import { PaginationService } from '@src/common/services/pagination.service';

@Injectable()
export class UsersService extends PaginationService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<UserEntity[] | PaginatedResult<UserEntity>> {
    if (paginationDto.mode == 'paginate') {
      return await this.paginate(paginationDto);
    }
    return await this.userRepository.find();
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findbyEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ email });
  }
}
