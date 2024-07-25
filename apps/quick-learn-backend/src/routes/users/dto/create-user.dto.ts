import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsUUID()
  uuid: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
