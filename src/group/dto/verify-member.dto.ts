import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifyMemberDto {
    @ApiProperty()
    @IsNotEmpty()
    verified: boolean;
}