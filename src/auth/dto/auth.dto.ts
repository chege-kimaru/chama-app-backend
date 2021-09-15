import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class AuthDto {

    @ApiProperty()
    @IsNotEmpty()
    @Matches(/\+[0-9]*/)
    phone: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    password: string;
}