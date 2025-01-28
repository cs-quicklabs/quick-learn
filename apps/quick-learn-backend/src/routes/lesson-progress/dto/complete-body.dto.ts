import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class completeBodyDto{
    @IsNotEmpty()
    @IsString()
    courseId: string; 

    @IsNotEmpty()
    @IsBoolean()
    isCompleted: boolean
}