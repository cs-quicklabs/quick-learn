import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsString } from "class-validator";

export class userParamsDto {
    @ApiProperty({
    name: 'id',
    required: true,
    type: String,
    description: 'Get the lesson by id',
    })
    @IsNotEmpty()
    @IsString()
    id:string


@ApiProperty({
 name: 'userId',
    required: false,
    type: String, // Aligning with the actual type in the route
    description: 'Optional user ID',
})
    @IsNotEmpty()
    @IsString()
    userId: string;
}
