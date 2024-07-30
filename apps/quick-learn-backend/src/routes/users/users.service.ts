import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResult } from '@src/common/interfaces/paginate.interface';
import { PaginationService } from '@src/common/services/pagination.service';
import { UserTypeEntity } from '@src/entities/user_type.entity';
import { SkillEntity } from '@src/entities/skill.entity';

const userRelations = ['user_type', 'skill'];
@Injectable()
export class UsersService extends PaginationService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserTypeEntity)
    private userTypeRepository: Repository<UserTypeEntity>,
    @InjectRepository(SkillEntity)
    private skillRepository: Repository<SkillEntity>,
  ) {
    super(userRepository);
  }

  async getMetadata(user: UserEntity) {
    const metadata = {};
    const [user_types, skills] = await Promise.all([
      this.getUserTypes(),
      this.getSkills(user.team_id),
    ]);
    metadata['user_types'] = user_types;
    metadata['skills'] = skills;
    return metadata;
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(
    user: UserEntity,
    paginationDto: PaginationDto,
  ): Promise<UserEntity[] | PaginatedResult<UserEntity>> {
    const userTypeId = user.user_type_id;
    if (paginationDto.mode == 'paginate') {
      return await this.paginate(
        paginationDto,
        { user_type_id: MoreThan(userTypeId) },
        [...userRelations],
      );
    }
    return await this.userRepository.find({
      where: { user_type_id: MoreThan(userTypeId) },
      relations: [...userRelations],
    });
  }

  async findOne(options: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...options },
    });
  }

  update(uuid: UserEntity['uuid'], payload: Partial<UserEntity>) {
    return this.userRepository.update({ uuid }, payload);
  }

  async remove(uuid: UserEntity['uuid']): Promise<void> {
    await this.userRepository.delete(uuid);
  }

  async findByEmailOrUUID(email: string, uuid: string): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: [{ email }, { uuid }],
    });
  }

  async getUserTypes(): Promise<UserTypeEntity[]> {
    return await this.userTypeRepository.find({ where: { active: true } });
  }

  async getSkills(team_id: number): Promise<SkillEntity[]> {
    return await this.skillRepository.find({ where: { team_id } });
  }
}
