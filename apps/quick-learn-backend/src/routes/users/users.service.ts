import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FindOptionsWhere,
  ILike,
  MoreThan,
  Repository,
  Equal,
  Or,
  In,
  DeleteResult,
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
import { RoadmapService } from '../roadmap/roadmap.service';
import { AssignRoadmapsToUserDto } from './dto/assign-roadmap.dto';
import { CourseService } from '../course/course.service';
import { LessonService } from '../lesson/lesson.service';
import { FileService } from '@src/file/file.service';

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
    private roadmapService: RoadmapService,
    private courseService: CourseService,
    private lessonService: LessonService,
    private readonly FileService: FileService,
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
    filter: ListFilterDto & { active: boolean },
    extraRelations: string[] = [],
  ): Promise<UserEntity[] | PaginatedResult<UserEntity>> {
    const userTypeId = user.user_type_id;
    let conditions:
      | FindOptionsWhere<UserEntity>
      | FindOptionsWhere<UserEntity>[] = {
      active: filter.active ?? false,
      team_id: user.team_id,
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

    const relations = [...userRelations, ...extraRelations];

    if (paginationDto.mode == 'paginate') {
      const results = await this.paginate(paginationDto, conditions, relations);
      this.sortByLastLogin(results.items);
      return results;
    }
    const users = await this.userRepository.find({
      where: conditions,
      relations: relations,
    });
    this.sortByLastLogin(users);
    return users;
  }

  async getUserRoadmaps(userId: number, includeCourses = false) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.assigned_roadmaps', 'roadmap')
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .where('user.id = :userId', { userId })
      .andWhere('roadmap.archived = :archived', { archived: false });

    if (includeCourses) {
      queryBuilder
        .leftJoinAndSelect('roadmap.courses', 'course')
        .leftJoinAndSelect('course.lessons', 'lesson')
        .andWhere('course.archived = :courseArchived', {
          courseArchived: false,
        })
        .andWhere('lesson.archived = :lessonArchived', {
          lessonArchived: false,
        })
        .orderBy('course.id', 'ASC')
        .addOrderBy('lesson.id', 'ASC');
    }

    const user = await queryBuilder.getOne();
    if (!user?.assigned_roadmaps) {
      return [];
    }

    // Transform the response to include lesson_ids while maintaining entity types
    if (includeCourses) {
      user.assigned_roadmaps.forEach((roadmap) => {
        if (roadmap.courses) {
          roadmap.courses.forEach((course) => {
            (course as any).lesson_ids =
              course.lessons?.map((lesson) => lesson.id) || [];
            delete course.lessons;
          });
        }
      });
    }

    return user.assigned_roadmaps;
  }
  async getRoadmapDetails(userId: number, id: number) {
    const roadmap = await this.roadmapService.getUserRoadmapDetails(userId, id);

    if (!roadmap) {
      throw new BadRequestException(en.RoadmapNotFound);
    }

    // Add lesson_ids to courses if courses exist
    if (roadmap.courses) {
      roadmap.courses.forEach((course) => {
        (course as any).lesson_ids =
          course.lessons?.map((lesson) => lesson.id) || [];
        delete course.lessons;
      });
    }

    return roadmap;
  }

  async getCourseDetails(userId: number, id: number, roadmap?: number) {
    const course = await this.courseService.getUserCourseDetails(
      userId,
      id,
      roadmap,
    );

    if (!course) {
      throw new BadRequestException(en.CourseNotFound);
    }

    return course;
  }

  async getLessonDetails(
    userId: number,
    id: number,
    courseId: number,
    roadmap?: number,
  ) {
    const lesson = await this.lessonService.getUserLessonDetails(
      userId,
      id,
      courseId,
      roadmap,
    );

    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }

    return lesson;
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

  async findOne(
    options: FindOptionsWhere<UserEntity>,
    relations: string[] = [],
  ): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { ...options },
      relations,
    });
  }

  async updateUser(
    uuid: UserEntity['uuid'],
    payload: Partial<UserEntity>,
    imageDeleteRequired = false,
  ) {
    const user = await this.findOne({ uuid });

    if (!user) {
      throw new BadRequestException(en.userNotFound);
    }

    // ON PROFILE CHANGE VERIFY IF LOGO HAS CHANGED AND PERVIOUS IMAGE IS NOT EMPTY STRING
    if (
      imageDeleteRequired &&
      user.profile_image !== payload.profile_image &&
      user.profile_image !== '' &&
      user.profile_image !== null
    ) {
      // DELETE OLD IMAGE FROM S3 BUCKET
      await this.FileService.deleteFiles([user.profile_image]);
    }

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

  async assignRoadmaps(
    uuid: UserEntity['uuid'],
    assignRoadmapsToUserDto: AssignRoadmapsToUserDto,
  ) {
    const user = await this.findOne({ uuid });

    if (!user) {
      throw new BadRequestException(en.userNotFound);
    }

    const roadmaps = await this.roadmapService.getMany({
      id: In(assignRoadmapsToUserDto.roadmaps),
    });

    if (roadmaps.length != assignRoadmapsToUserDto.roadmaps.length) {
      throw new BadRequestException(en.invalidRoadmaps);
    }

    await this.userRepository.save({ ...user, assigned_roadmaps: roadmaps });
  }

  async delete(condition: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
    const user = await this.findOne(condition);

    if (!user) {
      throw new BadRequestException(en.userNotFound);
    }

    // Delete associated sessions first
    await this.sessionService.delete({ user: { id: user.id } });

    // Delete the user
    return this.userRepository.delete(condition);
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
