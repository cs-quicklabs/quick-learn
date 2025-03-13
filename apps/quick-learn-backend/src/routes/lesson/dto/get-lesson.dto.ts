import { IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';

export class GetLessonDto {
  @ValidateIf((o) => !o?.flagged || o?.flagged != 'true')
  @IsString()
  @IsIn(['true', 'false'])
  approved?: string;

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'])
  flagged?: string;

  @IsOptional()
  @IsString()
  @IsIn(['true', 'false'])
  isArchived?: string;
}
