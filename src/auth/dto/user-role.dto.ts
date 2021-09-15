import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserRoleDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;
    @ApiProperty()
    @IsNotEmpty()
    roleId: number;
}