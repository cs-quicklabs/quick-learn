import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
<<<<<<< HEAD
<<<<<<< HEAD
import { Repository } from 'typeorm';
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

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
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
=======
=======
import { Repository } from 'typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

<<<<<<< HEAD
  remove(id: number) {
    return `This action removes a #${id} user`;
>>>>>>> 71ee2d5 (seting entities and defining endpoints)
=======
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findbyEmail(email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({ email });
>>>>>>> 6db7f4c (authhentication module with jwt implemented, password hashing is pending)
  }
}
