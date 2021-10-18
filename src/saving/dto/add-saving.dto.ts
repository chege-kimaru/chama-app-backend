import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddSavingDto {
    @ApiProperty()
    @IsNotEmpty()
    amount: number;
}