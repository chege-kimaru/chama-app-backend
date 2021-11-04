import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { LoanMiddleware } from './middleware/loan.midleware';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LoanProduct } from './models/loan-product.model';
import { Loan } from './models/loan.model';
import { Payment } from 'src/payments/models/payment.model';
import { LoanPayment } from './models/loan-payment.model';
import { MpesaC2BPayment } from 'src/payments/models/mpesa-c2b-payment.model';
import { User } from 'src/auth/models/user.model';
import { Saving } from 'src/saving/model/saving.model';
import { GroupMember } from 'src/group/models/group-member.model';
import { Group } from 'src/group/models/group.model';
import { GroupMiddleware } from './middleware/group.middleware';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    SequelizeModule.forFeature(
      [LoanProduct, Loan, Payment, LoanPayment, MpesaC2BPayment, User, Saving, GroupMember, Group]
    )
  ],
  providers: [LoanService],
  controllers: [LoanController]
})
export class LoanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GroupMiddleware)
      .forRoutes(LoanController)
      .apply(LoanMiddleware)
      .exclude(
        { method: RequestMethod.GET, path: '/groups/:groupId/loans/loan-payments' },
        { method: RequestMethod.POST, path: '/groups/:groupId/loans/request' },
        { method: RequestMethod.GET, path: '/groups/:groupId/loans' },
        { method: RequestMethod.GET, path: '/groups/:groupId/loans/user' },
      )
      .forRoutes(LoanController)
  }

}
