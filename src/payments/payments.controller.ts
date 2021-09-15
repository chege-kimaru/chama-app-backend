import {
  Controller, Get, NotFoundException, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BaseFilterDto } from 'src/shared/base-filter.dto';
import { DecodeQueryPipe } from 'src/shared/decode-query.pipe';
import { createFilterFromQueries, MANAGER_ROLES } from 'src/shared/utils';
import { MpesaB2CPayment } from './models/mpesa-b2c-payment.model';
import { Payment } from './models/payment.model';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {

  constructor(private paymentService: PaymentsService) {
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get MpesaB2CPayments' })
  @ApiResponse({ status: 200, type: MpesaB2CPayment, isArray: true })
  @ApiQuery({ name: 'filter', required: false })
  @Roles(MANAGER_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('mpesa-B2C-payments')
  async getMpesaB2CPayments(@Query('filter', DecodeQueryPipe) filterDto: BaseFilterDto,
    @Query() query: any) {
    filterDto = createFilterFromQueries(filterDto, query);
    return this.paymentService.getMpesaB2CPayments(filterDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Mpesa B2C payment details' })
  @ApiResponse({ status: 200, type: Payment })
  @Roles(MANAGER_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('mpesa-B2C-payments/:paymentId')
  async getMpesaB2CPaymentDetails(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentService.getMpesaB2CPaymentDetails(paymentId);
    if (payment) return payment;
    else throw new NotFoundException('This B2C payment does not exist');
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get MpesaC2BPayments' })
  @ApiResponse({ status: 200, type: MpesaB2CPayment, isArray: true })
  @ApiQuery({ name: 'filter', required: false })
  @Roles(MANAGER_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('mpesa-C2B-payments')
  async getMpesaC2BPayments(@Query('filter', DecodeQueryPipe) filterDto: BaseFilterDto,
    @Query() query: any) {
    filterDto = createFilterFromQueries(filterDto, query);
    return this.paymentService.getMpesaC2BPayments(filterDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Mpesa C2B payment details' })
  @ApiResponse({ status: 200, type: Payment })
  @Roles(MANAGER_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('mpesa-C2B-payments/:paymentId')
  async getMpesaC2BPaymentDetails(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentService.getMpesaC2BPaymentDetails(paymentId);
    if (payment) return payment;
    else throw new NotFoundException('This C2B payment does not exist');
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payments' })
  @ApiResponse({ status: 200, type: Payment, isArray: true })
  @ApiQuery({ name: 'filter', required: false })
  @Roles(MANAGER_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/')
  async getPayments(@Query('filter', DecodeQueryPipe) filterDto: BaseFilterDto,
    @Query() query: any) {
    filterDto = createFilterFromQueries(filterDto, query);
    return this.paymentService.getPayments(filterDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  @ApiResponse({ status: 200, type: Payment })
  @Roles(MANAGER_ROLES)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:paymentId')
  async getPaymentDetails(@Param('paymentId') paymentId: string) {
    const payment = await this.paymentService.getPaymentDetails(paymentId);
    if (payment) return payment;
    else throw new NotFoundException('This payment does not exist');
  }
}
