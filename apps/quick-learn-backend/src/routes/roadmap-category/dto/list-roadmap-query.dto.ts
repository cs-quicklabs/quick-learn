import { Transform } from "class-transformer";
import { IsBoolean, IsOptional } from "class-validator";

export class ListRoadmapQueryDto {
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_roadmap?: boolean

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  is_courses?: boolean
}
