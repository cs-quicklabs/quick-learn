import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BasePaginationDto, SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { CreateLessonDto, GetLessonDto, UpdateLessonDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';
import { PaginationDto } from '../users/dto';
import { CourseArchiveDto } from '../course/dto/course-archive.dto';
import { Public } from '@src/common/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@src/common/decorators/roles.decorator';
import { UserTypeId } from '@src/common/enum/user_role.enum';
import { MoreThan } from 'typeorm';
import { LessonParamDto } from './dto/lesson-param.dto';
import { TokenValidationDto } from './dto/token-validation.dto';
import { UserTypeIdEnum } from '@quick-learn/shared';

@ApiTags('Lessons')
@Controller({
  path: 'lesson',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class LessonController {
  constructor(private readonly service: LessonService) {}

  @ApiOperation({ summary: 'Get all the lessons.' })
  @Get()
  /**
   * Retrieves all lessons.
   * @returns A list of lessons.
   */
  async getLessons(): Promise<SuccessResponse> {
    const lessons = await this.service.getMany();
    return new SuccessResponse(en.getLessons, lessons);
  }

  @ApiOperation({ summary: 'Get all unapproved lessons.' })
  @Get('unapproved')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN, UserTypeIdEnum.EDITOR)
  /**
   * Retrieves all unapproved lessons.
   * @returns A list of lessons.
   */
  async getUnapprovedLessons(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const lessons = await this.service.getUnapprovedLessons(
      Number(paginationDto.page),
      Number(paginationDto.limit),
      String(paginationDto.q),
    );
    return new SuccessResponse(en.getLessons, lessons);
  }

  @ApiOperation({ summary: 'Get all archived lessons.' })
  @Get('archived')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN)
  async findAllArchivedLessons(
    @Query() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const lessons = await this.service.getArchivedLessons(paginationDto, [
      'course',
      'created_by_user',
      'archive_by_user',
      'approved_by_user',
    ]);
    return new SuccessResponse(en.getLessons, lessons);
  }

  @ApiOperation({ summary: 'Get all flagged lessons with optional search.' })
  @Get('flagged')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN, UserTypeIdEnum.EDITOR)
  async findAllFlaggedLessons(
    @Query() paginationDto: BasePaginationDto,
  ): Promise<SuccessResponse> {
    const lessons = await this.service.findAllFlaggedLesson(
      Number(paginationDto.page),
      Number(paginationDto.limit),
      paginationDto.q,
    );
    return new SuccessResponse(en.getLessons, lessons);
  }

  @ApiOperation({ summary: 'Create a new lesson.' })
  @Post()
  /**
   * Creates a new lesson.
   * @param user The user creating the lesson.
   * @param createLessonDto The data for creating the lesson.
   * @returns A promise that resolves to a success response.
   */
  async create(
    @CurrentUser() user: UserEntity,
    @Body() createLessonDto: CreateLessonDto,
  ): Promise<SuccessResponse> {
    await this.service.createLesson(user, createLessonDto);
    return new SuccessResponse(en.createLesson);
  }

  @ApiOperation({ summary: 'Get a specific lesson.' })
  @Get('/:id')
  /**
   * Retrieves a specific lesson by its id.
   * @param id The id of the lesson that needs to be retrieved.
   * @throws BadRequestException if the lesson doesn't exist
   * @returns A promise that resolves to a success response containing the lesson entity.
   */
  async get(
    @Param() param: LessonParamDto,
    @Query() getLessonDto: GetLessonDto,
  ): Promise<SuccessResponse> {
    const conditions = { id: +param.id };
    const relations = ['created_by_user', 'course'];
    if (getLessonDto.approved)
      conditions['approved'] = getLessonDto.approved == 'true';
    if (getLessonDto.flagged) {
      conditions['flagged_lesson'] = {
        id: MoreThan(0),
      };
      relations.push('flagged_lesson');
      relations.push('flagged_lesson.user');
    }
    if (getLessonDto.isArchived === 'true') {
      relations.push('archive_by_user');
    }

    const lesson = await this.service.get(conditions, relations);
    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }
    return new SuccessResponse(en.getLesson, lesson);
  }

  @ApiOperation({ summary: 'Update an existing lesson.' })
  @Patch('/:id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN, UserTypeIdEnum.EDITOR)
  /**
   * Updates an existing lesson.
   * @param id The id of the lesson that needs to be updated.
   * @param updateLessonDto The data for updating the lesson.
   * @throws BadRequestException if the lesson doesn't exist
   * @returns A promise that resolves to a success response.
   */
  async update(
    @Param() param: LessonParamDto,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.updateLesson(user, +param.id, updateLessonDto);
    return new SuccessResponse(en.updateLesson);
  }

  @UseGuards(RolesGuard)
  @Roles(UserTypeId.SUPER_ADMIN, UserTypeId.ADMIN)
  @ApiOperation({ summary: 'Approved an lessons.' })
  @Patch('/:id/approve')
  /**
   * Approves an existing lesson.
   * @param id The id of the lesson that needs to be approved.
   * @param user The user approving the lesson.
   * @throws BadRequestException if the lesson doesn't exist
   * @returns A promise that resolves to a success response.
   */
  async approve(
    @Param() param: LessonParamDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.approveLesson(+param.id, user.id);
    return new SuccessResponse(en.approveLesson);
  }

  @UseGuards(RolesGuard)
  @Roles(UserTypeId.SUPER_ADMIN, UserTypeId.ADMIN)
  @ApiOperation({ summary: 'Unflag an lessons.' })
  @Patch('/:id/unflag')
  /**
   * Approves an existing lesson.
   * @param id The id of the lesson that needs to be approved.
   * @param user The user approving the lesson.
   * @throws BadRequestException if the lesson doesn't exist
   * @returns A promise that resolves to a success response.
   */
  async unFlag(@Param() param: LessonParamDto): Promise<SuccessResponse> {
    await this.service.unFlagLesson(+param.id);
    return new SuccessResponse(en.successUnflagLesson);
  }

  @ApiOperation({ summary: 'Archive an lessons.' })
  @Patch('/:id/archive')
  /**
   * Archives an existing lesson.
   * @param id The id of the lesson that needs to be archived.
   * @param user The user archiving the lesson.
   * @throws BadRequestException if the lesson doesn't exist
   * @returns A promise that resolves to a success response.
   */
  async archive(
    @Param() param: LessonParamDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.archiveLesson(+param.id, user.id);
    return new SuccessResponse(en.archiveLesson);
  }

  @ApiOperation({ summary: 'Activate or deactivate a lesson.' })
  @Post('activate')
  async activateLesson(
    @Body() body: CourseArchiveDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    if (!body.active) {
      await this.service.archiveLesson(user.id, body.id);
      return new SuccessResponse(en.archiveLesson);
    }

    await this.service.unarchiveLesson(body.id);
    return new SuccessResponse(en.unarchiveLesson);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserTypeIdEnum.SUPERADMIN, UserTypeIdEnum.ADMIN, UserTypeIdEnum.EDITOR)
  @ApiOperation({ summary: 'Permanently delete a lesson' })
  async deleteLesson(@Param() param: LessonParamDto): Promise<SuccessResponse> {
    await this.service.deleteLesson(+param.id);
    return new SuccessResponse(en.lessonDeleted);
  }

  /**
   *
   * @param user current user id
   * @param lessonId lesson id
   * @param courseId course id
   * @param token validatation token sent on mail
   * @returns lesson details
   */

  @Get('daily/:token')
  @Public()
  @ApiOperation({ summary: "Get current user's lesson by id and course id" })
  async getCurrentUserLessonsByIdAndCourseId(
    @Param() param: TokenValidationDto,
  ): Promise<SuccessResponse> {
    const dailyLessonDetails = await this.service.getDailyLessonFromToken(
      param.token,
    );
    return new SuccessResponse(en.lessonForTheDay, dailyLessonDetails);
  }

  @ApiOperation({ summary: 'Flag a lesson for review' })
  @Post('flag/:token')
  @Public()
  async flagLesson(@Param('token') token: string): Promise<SuccessResponse> {
    await this.service.flagLesson(token);
    return new SuccessResponse(en.succcessLessonFlagged);
  }
}
