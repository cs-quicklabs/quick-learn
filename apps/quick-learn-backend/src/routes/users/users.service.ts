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
  FindOptionsOrder,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '@src/common/services/pagination.service';
import { SkillEntity } from '@src/entities/skill.entity';
import { CreateUserDto, ListFilterDto, PaginationDto } from './dto';
import { PaginatedResult } from '@src/common/interfaces';
import { EmailService } from '@src/common/modules/email/email.service';
import {
  CourseEntity,
  UserEntity,
  UserLessonProgressEntity,
  UserTypeEntity,
} from '@src/entities';
import { SessionService } from '../auth/session.service';
import { en } from '@src/lang/en';
import { RoadmapService } from '../roadmap/roadmap.service';
import { AssignRoadmapsToUserDto } from './dto/assign-roadmap.dto';
import { CourseService } from '../course/course.service';
import { LessonService } from '../lesson/lesson.service';
import { FileService } from '@src/file/file.service';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { SkillsService } from '../skills/skills.service';
import { UserTypeService } from './user-type.service';

const userRelations = ['user_type', 'skill', 'team'];
interface CourseWithLessonIds extends CourseEntity {
  lesson_ids?: { id: number; name: string }[];
}

@Injectable()
export class UsersService extends PaginationService<UserEntity> {
  private readonly hashSalt = 10;
  constructor(
    @InjectRepository(UserEntity)
    userRepository: Repository<UserEntity>,
    private readonly userTypeService: UserTypeService,
    private readonly skillService: SkillsService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
    private readonly roadmapService: RoadmapService,
    private readonly courseService: CourseService,
    private readonly lessonService: LessonService,
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

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.hashSalt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async create(createUserDto: CreateUserDto & { team_id: number }) {
    const foundUser = await this.get({ email: createUserDto.email });

    const skill = await this.skillService.get({
      id: createUserDto.skill_id,
    });

    if (!skill) {
      throw new BadRequestException(en.invalidSkill);
    }

    if (foundUser?.active) {
      throw new BadRequestException(en.emailAlreadyExists);
    }

    if (foundUser && !foundUser.active) {
      throw new BadRequestException(en.deactiveUserAddError);
    }

    let user = this.repository.create(createUserDto);
    user = await this.repository.save(user);

    this.emailService.welcomeEmail(user.email);

    return user;
  }

  async findAll(
    user: UserEntity,
    paginationDto: PaginationDto,
    filter: ListFilterDto & { active: boolean },
    extraRelations: string[] = [],
    sort?: FindOptionsOrder<UserEntity>,
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
            code: filter.user_type_code,
          },
        },
      ];
      conditions = queryConditions;
    }

    const relations = [...userRelations, ...extraRelations];

    let results: UserEntity[];
    let paginatedResults: PaginatedResult<UserEntity>;

    if (paginationDto.mode === 'paginate') {
      paginatedResults = await this.paginate(
        paginationDto,
        conditions,
        relations,
        sort,
      );
      results = paginatedResults.items;
    } else {
      results = await this.repository.find({
        where: conditions,
        relations,
        order: sort,
      });
    }

    if (!sort) {
      this.sortByLastLogin(results);
    }

    return paginationDto.mode === 'paginate'
      ? { ...paginatedResults, items: results }
      : results;
  }

  async getUserRoadmaps(userId: number, includeCourses = false) {
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.assigned_roadmaps', 'roadmap')
      .leftJoinAndSelect('roadmap.roadmap_category', 'roadmap_category')
      .where('user.id = :userId', { userId })
      .andWhere('roadmap.archived = :archived', { archived: false });

    if (includeCourses) {
      queryBuilder.leftJoinAndSelect(
        'roadmap.courses',
        'course',
        'course.archived = :courseArchived',
        {
          courseArchived: false,
        },
      );

      queryBuilder
        .leftJoinAndSelect(
          'course.lessons',
          'lesson',
          'lesson.archived = :lessonArchived',
          {
            lessonArchived: false,
          },
        )
        .orderBy('course.id', 'ASC')
        .addOrderBy('lesson.id', 'ASC');
    }

    const user = await queryBuilder.getOne();
    if (!user?.assigned_roadmaps) {
      return [];
    }

    if (includeCourses) {
      user.assigned_roadmaps.forEach((roadmap) => {
        if (roadmap.courses) {
          roadmap.courses.forEach((course) => {
            const typedCourse = course as CourseWithLessonIds;
            typedCourse.lesson_ids =
              course.lessons?.map((lesson) => ({
                id: lesson.id,
                name: lesson.name,
              })) || [];
            delete typedCourse.lessons;
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

    if (roadmap.courses) {
      roadmap.courses.forEach((course) => {
        const typedCourse = course as CourseWithLessonIds;
        typedCourse.lesson_ids =
          course.lessons?.map((lesson) => ({
            id: lesson.id,
            name: lesson.name,
          })) || [];
        delete typedCourse.lessons;
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
    return await this.repository.findOne({
      where: { ...options },
      relations,
    });
  }

  async findOneWithSelectedRelationData(
    options: FindOptionsWhere<UserEntity>,
    relations: string[] = [],
  ): Promise<UserEntity> {
    const queryBuilder = this.repository
      .createQueryBuilder('user')
      .where({ ...options });

    const assignRoadmapRelation = relations.includes('assigned_roadmaps');
    const assignRoadmapCoursesRelation = relations.includes(
      'assigned_roadmaps.courses',
    );
    const assignRoadmapCoursesLessonRelation = relations.includes(
      'assigned_roadmaps.courses.lessons',
    );

    // Dynamically add joins based on relations array
    if (assignRoadmapRelation) {
      queryBuilder.leftJoinAndSelect(
        'user.assigned_roadmaps',
        'assigned_roadmaps',
        'assigned_roadmaps.archived = :isArchived',
        { isArchived: false },
      );
    }

    if (assignRoadmapCoursesRelation) {
      queryBuilder.leftJoinAndSelect(
        'assigned_roadmaps.courses',
        'courses',
        'courses.archived = :isArchived',
        { isArchived: false },
      );
    }

    if (assignRoadmapCoursesLessonRelation) {
      queryBuilder.leftJoinAndSelect(
        'courses.lessons',
        'lessons',
        'lessons.archived = :isArchived',
        { isArchived: false },
      );
    }

    // Select specific fields
    const selectFields = ['user'];

    if (assignRoadmapRelation) {
      selectFields.push('assigned_roadmaps');
    }

    if (assignRoadmapCoursesRelation) {
      selectFields.push('courses');
    }

    if (assignRoadmapCoursesLessonRelation) {
      selectFields.push('lessons.id');
      selectFields.push('lessons.name');
    }

    queryBuilder.select(selectFields);

    const user = await queryBuilder.getOne();

    return user;
  }

  async getUnreadUserLessons(userId: number) {
    const user = await this.repository
      .createQueryBuilder('user')
      .leftJoin('user.assigned_roadmaps', 'roadmap')
      .leftJoin('roadmap.courses', 'course')
      .leftJoin('course.lessons', 'lesson')
      .addSelect(['roadmap.id', 'course.id', 'lesson.id', 'lesson.name'])
      .where('user.id = :userId', { userId })
      .andWhere('roadmap.archived = :archived', { archived: false })
      .andWhere('course.archived = :courseArchived', { courseArchived: false })
      .andWhere(
        'lesson.archived = :lessonArchived AND lesson.approved = :lessonApproved',
        { lessonArchived: false, lessonApproved: true },
      )
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from(UserLessonProgressEntity, 'ulp')
          .where('ulp.lesson_id = lesson.id')
          .andWhere('ulp.user_id = :userId', { userId })
          .getQuery();
        return `NOT EXISTS (${subQuery})`;
      })
      .getOne();
    return (
      user?.assigned_roadmaps.flatMap((roadmap) =>
        roadmap.courses.flatMap((course) =>
          course.lessons.map((lesson) => ({
            lesson_id: lesson.id,
            course_id: course.id,
            roadmap_id: roadmap.id,
            name: lesson.name,
          })),
        ),
      ) || []
    );
  }

  async getUserAssignedRoadmaps(userId: number, isCountOnly = false) {
    let queryBuilder = this.repository
      .createQueryBuilder('user')
      .innerJoin('user.assigned_roadmaps', 'roadmap')
      .where('user.id = :userId', { userId });

    if (isCountOnly) {
      queryBuilder = queryBuilder.select('COUNT(roadmap.id)', 'count');
      return (await queryBuilder.getRawOne()).count;
    }

    return await queryBuilder.getOne();
  }

  async getUserSearchedQuery(
    usertype_id: number,
    query: string,
    userId: number,
  ) {
    //get confirm usertype
    const isMember = usertype_id === UserTypeId.MEMBER;

    const [roadmaps, courses, lessons] = await Promise.all([
      this.roadmapService.findSearchedRoadmap(userId, isMember, query),
      this.courseService.getSearchedCourses(userId, isMember, query),
      this.lessonService.getSearchedLessons(userId, isMember, query),
    ]);

    return { Roadmaps: roadmaps, Courses: courses, Lessons: lessons };
  }

  async updateUser(
    userId: UserEntity['id'],
    payload: Partial<UserEntity>,
    imageDeleteRequired = false,
  ) {
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new BadRequestException(en.userNotFound);
    }

    const verifyLogoChange =
      imageDeleteRequired &&
      user.profile_image !== payload.profile_image &&
      user.profile_image !== '' &&
      user.profile_image !== null;
    if (verifyLogoChange) {
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

    return this.repository.update({ id: userId }, payload);
  }

  async assignRoadmaps(
    userId: UserEntity['id'],
    assignRoadmapsToUserDto: AssignRoadmapsToUserDto,
  ) {
    // Find the user by userId
    const user = await this.findOne({ id: userId });

    if (!user) {
      throw new BadRequestException(en.userNotFound);
    }

    // Find the roadmaps using the provided IDs
    const roadmaps = await this.roadmapService.getMany({
      id: In(assignRoadmapsToUserDto.roadmaps),
    });

    // Check if the number of roadmaps matches the provided IDs
    if (roadmaps.length !== assignRoadmapsToUserDto.roadmaps.length) {
      throw new BadRequestException(en.invalidRoadmaps);
    }

    // Assign roadmaps to the user and save
    await this.repository.save({ ...user, assigned_roadmaps: roadmaps });
  }

  async delete(condition: FindOptionsWhere<UserEntity>): Promise<DeleteResult> {
    const user = await this.findOne(condition);

    if (!user) {
      throw new BadRequestException(en.userNotFound);
    }

    // Delete associated sessions first
    await this.sessionService.delete({ user: { id: user.id } });

    // Delete the user
    return this.repository.delete(condition);
  }

  async findByEmailOrUUID(email: string, uuid: string): Promise<UserEntity[]> {
    return await this.repository.find({
      where: [{ email }, { uuid }],
      relations: [...userRelations],
    });
  }

  async getUserTypes(): Promise<UserTypeEntity[]> {
    return await this.userTypeService.getMany({ active: true });
  }

  async getSkills(team_id: number): Promise<SkillEntity[]> {
    return await this.skillService.getMany({ team_id });
  }
}
