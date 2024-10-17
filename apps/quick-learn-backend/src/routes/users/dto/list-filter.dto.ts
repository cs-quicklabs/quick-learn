import { ApiProperty } from '@nestjs/swagger';
import { UserTypeCodeEnum } from '@quick-learn/shared';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

// DTO for the consult listing filter
export class ListFilterDto {
  @ApiProperty({ example: 'admin', required: false })
  @IsOptional()
  @IsEnum(UserTypeCodeEnum)
  user_type_code?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
