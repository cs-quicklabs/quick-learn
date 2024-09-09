import { PartialType } from '@nestjs/swagger';
import { CreateRoadmapDto } from './create-roadmap.dto';

export class UpdateRoadmapDto extends PartialType(CreateRoadmapDto) {}
