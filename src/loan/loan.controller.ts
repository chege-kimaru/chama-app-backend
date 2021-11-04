import { Body, Controller, Get, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { lipaNaMpesaResDto } from 'src/payments/dto/lipa-na-mpesa-res.dto';
import { parseIp } from 'src/shared/utils';
import { PayLoanDto } from './dto/pay-loan.dto';
import { RequestLoanDto } from './dto/request-loan.dto';
import { GroupMemberGuard } from './guard/group-member.guard';
import { LoanService } from './loan.service';

@Controller('groups/:groupId/loans')
export class LoanController {
    constructor(private loanService: LoanService) { }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Get('loan-products')
    getLoanProducts() {
        return this.loanService.getLoanProducts();
    }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Post('request')
    requestLoan(@Req() req: any, @Body() dto: RequestLoanDto) {
        return this.loanService.requestLoan(req.Group, req.user, dto);
    }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Post(':loanId/pay')
    payLoan(@Req() req: any, @Body() dto: PayLoanDto) {
        return this.loanService.payLoan(req.Group, req.user, req.Loan, dto.amount);
    }

    @Post(':loanId/pay/lipa-na-mpesa-callback')
    lipaNaMpesaCallback(@Req() req: any, @Body() data: any) {
        Logger.verbose({ 'Ip Address': parseIp(req) });
        Logger.verbose(data);
        data = lipaNaMpesaResDto(data);
        Logger.verbose(data);
        return this.loanService.completeMpesaPayment(data, req.Group, req.Loan);
    }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Get()
    async getGroupLoans(@Req() req: any) {
        return this.loanService.getGroupLoans(req.Group.id);
    }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Get('user')
    async getUserGroupLoans(@Req() req: any) {
        return this.loanService.getUserGroupLoans(req.Group.id, req.user.id);
    }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Get(':loanId')
    getLoanDetails(@Req() req: any) {
        return this.loanService.getLoanDetails(req.Loan.id);
    }

    @UseGuards(JwtAuthGuard, GroupMemberGuard)
    @Get(':loanId/payments')
    getLoanPayments(@Req() req: any) {
        return this.loanService.getLoanPayments(req.Loan.id);
    }
}
