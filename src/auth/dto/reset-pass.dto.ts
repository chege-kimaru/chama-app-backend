import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class ResetPassDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/\+[0-9]*/)
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}