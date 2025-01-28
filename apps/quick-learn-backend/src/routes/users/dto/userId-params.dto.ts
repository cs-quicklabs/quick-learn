import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class userIdParamsDto{
    @ApiProperty({
     name: 'userId',
    type: 'number',
    required: true,
    })
    @IsNotEmpty()
    @IsString()
    userId:string


    @ApiPropertyOptional({
        name: 'include_courses',
        required: false,
        type: Boolean,
        description: 'Include associated courses in the response',
    })
    @IsOptional()
    @IsBoolean()
    includeCourses?: boolean;
}