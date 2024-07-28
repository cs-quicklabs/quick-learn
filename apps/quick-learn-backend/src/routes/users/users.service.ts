import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  async findOne(options: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...options },
    });
  }

  update(uuid: UserEntity['uuid'], updateUserDto: UpdateUserDto) {
    return this.userRepository.update(uuid, updateUserDto);
  }

  async remove(uuid: UserEntity['uuid']): Promise<void> {
    await this.userRepository.delete(uuid);
  }
}
