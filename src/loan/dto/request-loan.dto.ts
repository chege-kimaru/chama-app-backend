import { IsNotEmpty } from "class-validator";

export class RequestLoanDto {
    @IsNotEmpty()
    loanProductId: string;
}