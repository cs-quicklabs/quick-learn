import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class courseCategoryParamsDto {
    @ApiProperty({
        name: 'id',
        type: 'string'
    })
    @IsNotEmpty()
    @IsString()
    id:string

   
}