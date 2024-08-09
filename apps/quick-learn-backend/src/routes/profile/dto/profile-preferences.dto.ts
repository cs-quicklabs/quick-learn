import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class profilePreferencesDTO {
  @ApiProperty({ example: true })
  @IsBoolean()
  enableAllAlerts: boolean;
}
