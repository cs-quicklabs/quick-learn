import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FindOptionsWhere,
  ILike,
  MoreThan,
  Repository,
  Equal,
  Or,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services/pagination.service';
import { SkillEntity } from '@src/entities/skill.entity';
import { CreateUserDto, ListFilterDto, PaginationDto } from './dto';
import { PaginatedResult } from '@src/common/interfaces';
import { EmailService } from '@src/common/modules/email/email.service';
import { emailSubjects } from '@src/common/constants/email-subject';
import { UserEntity, UserTypeEntity } from '@src/entities';
import { SessionService } from '../auth/session.service';
import { en } from '@src/lang/en';

const userRelations = ['user_type', 'skill', 'team'];
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
    private sessionService: SessionService,
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

  async create(createUserDto: CreateUserDto & { team_id: number }) {
    const foundUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    const skill = await this.skillRepository.findOne({
      where: { id: createUserDto.skill_id },
    });

    if (!skill) {
      throw new BadRequestException(en.invalidSkill);
    }

    if (foundUser && foundUser.active) {
      throw new BadRequestException('Email already exists.');
    }

    if (foundUser && !foundUser.active) {
      throw new BadRequestException(en.deactiveUserAddError);
    }

    let user = this.userRepository.create(createUserDto);
    user = await this.userRepository.save(user);

    // send email to the user
    const emailData = {
      body: '<p>Welcome to Quick Learn!</p><br/><p>You can now login to quick learn.</p>',
      recipients: [user.email],
      subject: emailSubjects.welcome,
    };
    this.emailService.email(emailData);

    return user;
  }

  async findAll(
    user: UserEntity,
    paginationDto: PaginationDto,
    filter: ListFilterDto,
  ): Promise<UserEntity[] | PaginatedResult<UserEntity>> {
    const userTypeId = user.user_type_id;
    let conditions:
      | FindOptionsWhere<UserEntity>
      | FindOptionsWhere<UserEntity>[] = {
      user_type_id: Or(Equal(userTypeId), MoreThan(userTypeId)),
    };

    // For getting data base on the user type
    if (filter.user_type_code) {
      conditions = {
        ...conditions,
        user_type: {
          code: filter.user_type_code,
        },
      };
    }

    if (paginationDto.q) {
      const queryConditions = [
        { email: ILike(`%${paginationDto.q}%`), ...conditions },
        { first_name: ILike(`%${paginationDto.q}%`), ...conditions },
        { last_name: ILike(`%${paginationDto.q}%`), ...conditions },
        { full_name: ILike(`%${paginationDto.q}%`), ...conditions },
        {
          ...conditions,
          user_type: {
            name: ILike(`%${paginationDto.q}%`),
          },
        },
      ];
      conditions = queryConditions;
    }

    if (paginationDto.mode == 'paginate') {
      const results = await this.paginate(paginationDto, conditions, [
        ...userRelations,
      ]);
      this.sortByLastLogin(results.items);
      return results;
    }
    const users = await this.userRepository.find({
      where: conditions,
      relations: [...userRelations],
    });
    this.sortByLastLogin(users);
    return users;
  }

  sortByLastLogin(users: UserEntity[]) {
    users.sort((a, b) => {
      if (a.last_login_timestamp === null) {
        return 1;
      } else if (b.last_login_timestamp === null) {
        return -1;
      } else {
        return (
          b.last_login_timestamp.getTime() - a.last_login_timestamp.getTime()
        );
      }
    });
  }

  async findOne(options: FindOptionsWhere<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...options },
    });
  }

  async updateUser(uuid: UserEntity['uuid'], payload: Partial<UserEntity>) {
    const user = await this.findOne({ uuid });

    if (payload.email) {
      const userByEmail = await this.findOne({ email: payload.email });
      if (userByEmail && user.id != userByEmail.id) {
        throw new BadRequestException(
          'User already associated with this email.',
        );
      }
    }

    if (!!payload.user_type_id && payload.user_type_id != user.user_type_id) {
      await this.sessionService.delete({ user: { id: user.id } });
    }

    return this.userRepository.update({ uuid }, payload);
  }

  async remove(uuid: UserEntity['uuid']): Promise<void> {
    await this.userRepository.delete(uuid);
  }

  async findByEmailOrUUID(email: string, uuid: string): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: [{ email }, { uuid }],
      relations: [...userRelations],
    });
  }

  async getUserTypes(): Promise<UserTypeEntity[]> {
    return await this.userTypeRepository.find({ where: { active: true } });
  }

  async getSkills(team_id: number): Promise<SkillEntity[]> {
    return await this.skillRepository.find({ where: { team_id } });
  }
}
