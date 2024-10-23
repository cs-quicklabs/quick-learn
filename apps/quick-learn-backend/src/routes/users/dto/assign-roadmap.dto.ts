import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty } from "class-validator";

export class AssignRoadmapsToUserDto {
  @ApiProperty({ example: ['1'] })
  @IsNotEmpty()
  @IsArray()
  roadmaps: string[];
}
