import { IsBoolean, IsNumber, IsNotEmpty } from 'class-validator';

export class UserActivateDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
