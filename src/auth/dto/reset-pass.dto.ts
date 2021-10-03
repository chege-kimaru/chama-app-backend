import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class ResetPassDto {
    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    code: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;
}