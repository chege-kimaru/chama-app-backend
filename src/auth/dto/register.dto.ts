import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class RegisterDto {


    @ApiProperty()
    @IsNotEmpty()
    @Matches(/\+[0-9]*/)
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    password: string;
}