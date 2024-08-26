import { CreateCourseCategoryDto } from './create-course-category.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateCourseCategoryDto extends OmitType(CreateCourseCategoryDto, [
  'team_id',
] as const) {}
