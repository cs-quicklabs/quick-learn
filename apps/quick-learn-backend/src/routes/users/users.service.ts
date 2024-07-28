import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findOne(options: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...options },
    });
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  update(uuid: UserEntity['uuid'], updateUserDto: UpdateUserDto) {
    return this.userRepository.update(uuid, updateUserDto);
  }

  async remove(uuid: UserEntity['uuid']): Promise<void> {
    await this.userRepository.delete(uuid);
  }
}
