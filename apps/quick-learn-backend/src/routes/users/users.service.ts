import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { UserEntity } from '@src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services/pagination.service';
import { UserTypeEntity } from '@src/entities/user_type.entity';
import { SkillEntity } from '@src/entities/skill.entity';
import { CreateUserDto, ListFilterDto, PaginationDto } from './dto';
import { PaginatedResult } from '@src/common/interfaces';
import { EmailService } from '@src/common/modules/email/email.service';
import { emailSubjects } from '@src/common/constants/email-subject';

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
    private emailService: EmailService,
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
    const foundUser = await this.userRepository.count({
      where: { email: createUserDto.email },
    });
    if (foundUser) {
      throw new BadRequestException('Email already exists.');
    }
    const user = await this.userRepository.create(createUserDto);

    // send email to the user
    const emailData = {
      body: '<p>Welcome to Quick Learn!</p><br/><p>You can now login to quick learn.</p>',
      recipients: [user.email],
      subject: emailSubjects.welcome,
    };
    this.emailService.email(emailData);

    return await this.userRepository.save(user);
  }

  async findAll(
    user: UserEntity,
    paginationDto: PaginationDto,
    filter: ListFilterDto,
  ): Promise<UserEntity[] | PaginatedResult<UserEntity>> {
    const userTypeId = user.user_type_id;
    let conditions: FindOptionsWhere<UserEntity> = {
      user_type_id: MoreThan(userTypeId),
    };
    if (filter.user_type_code) {
      conditions = {
        ...conditions,
        user_type: {
          code: filter.user_type_code,
        },
      };
    }
    if (paginationDto.mode == 'paginate') {
      return await this.paginate(paginationDto, { ...conditions }, [
        ...userRelations,
      ]);
    }
    return await this.userRepository.find({
      where: { ...conditions },
      relations: [...userRelations],
    });
  }

  async findOne(options: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...options },
    });
  }

  async update(uuid: UserEntity['uuid'], payload: Partial<UserEntity>) {
    const user = await this.findOne({ uuid });
    if (payload.email) {
      const userByEmail = await this.findOne({ email: payload.email });
      if (userByEmail && user.id != userByEmail.id) {
        throw new BadRequestException(
          'User already associated with this email.',
        );
      }
    }
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
