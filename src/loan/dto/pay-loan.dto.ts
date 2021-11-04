import { IsNotEmpty } from "class-validator";

export class PayLoanDto {
    @IsNotEmpty()
    amount: number;
}