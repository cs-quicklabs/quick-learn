import { PartialType } from '@nestjs/mapped-types';
import { CreateRoadmapCategoryDto } from './create-roadmap_category.dto';

export class UpdateRoadmapCategoryDto extends PartialType(
  CreateRoadmapCategoryDto,
) {}
