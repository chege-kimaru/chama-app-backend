import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class AuthDto {

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    password: string;
}