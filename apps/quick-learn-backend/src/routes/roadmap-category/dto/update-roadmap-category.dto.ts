import { CreateRoadmapCategoryDto } from './create-roadmap-category.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateRoadmapCategoryDto extends OmitType(
  CreateRoadmapCategoryDto,
  ['team_id'],
) {}
