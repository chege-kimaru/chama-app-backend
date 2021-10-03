import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches } from "class-validator";

export class PhoneDto {
    @ApiProperty()
    @IsNotEmpty()
    phone: string;
}