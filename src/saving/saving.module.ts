import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SavingService } from './saving.service';
import { SavingController } from './saving.controller';
import { GroupMiddleware } from './middleware/group.middleware';
import { SequelizeModule } from '@nestjs/sequelize';
import { Saving } from './model/saving.model';
import { Group } from 'src/group/models/group.model';
import { GroupMember } from 'src/group/models/group-member.model';
import { MpesaC2BPayment } from 'src/payments/models/mpesa-c2b-payment.model';
import { User } from 'src/auth/models/user.model';
import { Payment } from 'src/payments/models/payment.model';
import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from 'src/auth/auth.module';
import { GroupMemberGuard } from './guard/group-member.guard';

@Module({
  imports: [
    SequelizeModule.forFeature([Saving, Group, GroupMember, User, Payment, MpesaC2BPayment]),
    SharedModule,
    AuthModule
  ],
  providers: [SavingService],
  controllers: [SavingController]
})
export class SavingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GroupMiddleware)
      .forRoutes(SavingController)
  }
}
