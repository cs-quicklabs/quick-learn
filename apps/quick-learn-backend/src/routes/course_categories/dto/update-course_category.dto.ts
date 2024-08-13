import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseCategoryDto } from './create-course_category.dto';

export class UpdateCourseCategoryDto extends PartialType(CreateCourseCategoryDto) {}
