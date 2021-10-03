import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateGroupDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;

    adminId: string;
    code: number;
}