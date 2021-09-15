import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { Payment } from './models/payment.model';
import { RavePayment } from './models/rave.payment.model';
import { MpesaC2BPayment } from './models/mpesa-c2b-payment.model';
import { MpesaB2CPayment } from './models/mpesa-b2c-payment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, RavePayment, MpesaC2BPayment, MpesaB2CPayment]),
    AuthModule,
    SharedModule
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {

}
