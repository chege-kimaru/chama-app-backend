import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class PhoneCodeDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(/\+[0-9]*/)
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    code: string;
}