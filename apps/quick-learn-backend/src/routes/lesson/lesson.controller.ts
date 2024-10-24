import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { CreateLessonDto, UpdateLessonDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';
import { PaginationDto } from '../users/dto';

@ApiTags('Lessons')
@Controller({
  path: 'lesson',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class LessonController {
  constructor(private service: LessonService) {}

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

  @ApiOperation({ summary: 'Get all unapproved the lessons.' })
  @Get('unapproved')
  /**
   * Retrieves all unapproved lessons.
   * @returns A list of lessons.
   */
  async getUnapprovedLessons(): Promise<SuccessResponse> {
    const lessons = await this.service.getMany(
      { approved: false },
      { updated_at: 'ASC' },
      ['created_by_user'],
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
    @Param('id') id: string,
    @Query('approved') approved: string,
  ): Promise<SuccessResponse> {
    const lesson = await this.service.get(
      { id: +id, approved: approved == 'true' },
      ['created_by_user', 'course'],
    );
    if (!lesson) {
      throw new BadRequestException(en.lessonNotFound);
    }
    return new SuccessResponse(en.getLesson, lesson);
  }

  @ApiOperation({ summary: 'Update an existing lesson.' })
  @Patch('/:id')
  /**
   * Updates an existing lesson.
   * @param id The id of the lesson that needs to be updated.
   * @param updateLessonDto The data for updating the lesson.
   * @throws BadRequestException if the lesson doesn't exist
   * @returns A promise that resolves to a success response.
   */
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.updateLesson(user, +id, updateLessonDto);
    return new SuccessResponse(en.updateLesson);
  }

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
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.approveLesson(+id, user.id);
    return new SuccessResponse(en.approveLesson);
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
    @Param('id') id: string,
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    await this.service.archiveLesson(+id, user.id);
    return new SuccessResponse(en.archiveLesson);
  }

  @ApiOperation({ summary: 'Get all archived lessons.' })
  @Post('archived')
  async findAllArchivedLessons(
    @CurrentUser() user: UserEntity,
    @Body() paginationDto: PaginationDto,
  ): Promise<SuccessResponse> {
    const lessons = await this.service.getArchivedLessons(paginationDto, [
      'course',
      'created_by_user',
      'archive_by_user',
      'approved_by_user',
    ]);
    return new SuccessResponse(en.getLessons, lessons);
  }

  @ApiOperation({ summary: 'Activate or deactivate a lesson.' })
  @Post('activate')
  async activateLesson(
    @Body() body: { id: number; active: boolean },
    @CurrentUser() user: UserEntity,
  ): Promise<SuccessResponse> {
    if (!body.active) {
      await this.service.archiveLesson(user.id, body.id);
      return new SuccessResponse(en.archiveLesson);
    }

    await this.service.unarchiveLesson(body.id);
    return new SuccessResponse(en.unarchiveLesson);
  }
}
