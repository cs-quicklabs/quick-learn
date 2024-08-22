import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { FilePathEnum } from '@quick-learn/shared';

export class FileQueryDto {
  @ApiProperty({ example: 'profile', required: false })
  @IsEnum(FilePathEnum)
  path: string;
}
