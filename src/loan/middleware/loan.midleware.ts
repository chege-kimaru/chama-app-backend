import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { LoanService } from '../loan.service';

@Injectable()
export class LoanMiddleware implements NestMiddleware {
    constructor(private loanService: LoanService) {
    }

    async use(req: any, res: Response, next: Function) {
        try {
            const loan = await this.loanService.findLoanById(req.params.loanId);
            if (loan?.id) {
                req.Loan = loan;
                next();
            } else {
                throw new NotFoundException('This loan does not exist');
            }
        } catch (e) {
            throw e;
        }
    }
}