import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/auth/models/user.model';
import { BaseFilterDto } from 'src/shared/base-filter.dto';
import { defaultFilterOptions } from 'src/shared/utils';
import { MpesaB2CPayment } from './models/mpesa-b2c-payment.model';
import { MpesaC2BPayment } from './models/mpesa-c2b-payment.model';
import { Payment } from './models/payment.model';

@Injectable()
export class PaymentsService {

  constructor(
    @InjectModel(Payment) private paymentModel: typeof Payment,
    @InjectModel(MpesaB2CPayment) private mpesaB2CPaymentModel: typeof MpesaB2CPayment,
    @InjectModel(MpesaC2BPayment) private mpesaC2BPaymentModel: typeof MpesaC2BPayment,
  ) {
  }

  async getPayments(filter?: BaseFilterDto) {
    const options = defaultFilterOptions(filter, []);
    options.include = [
      {
        model: User,
        attributes: { exclude: ['password'] }
      }
    ];
    if (filter.showCount) {
      return this.paymentModel.findAndCountAll(options);
    } else {
      return this.paymentModel.findAll(options);
    }
  }

  getPaymentDetails(paymentId: string) {
    return this.paymentModel.findByPk(paymentId, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        },
        {
          model: MpesaB2CPayment,
          required: false
        },
        {
          model: MpesaC2BPayment,
          required: false
        },
      ]
    });
  }

  async getMpesaC2BPayments(filter?: BaseFilterDto) {
    const options = defaultFilterOptions(filter, []);
    options.include = [
      {
        model: User,
        attributes: { exclude: ['password'] }
      },
      {
        model: Payment,
        required: false
      }
    ];
    if (filter.showCount) {
      return this.mpesaC2BPaymentModel.findAndCountAll(options);
    } else {
      return this.mpesaC2BPaymentModel.findAll(options);
    }
  }

  getMpesaC2BPaymentDetails(paymentId: string) {
    return this.mpesaC2BPaymentModel.findByPk(paymentId, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        },
        {
          model: Payment,
          required: false
        },
      ]
    });
  }

  async getMpesaB2CPayments(filter?: BaseFilterDto) {
    const options = defaultFilterOptions(filter, []);
    options.include = [
      {
        model: User,
        attributes: { exclude: ['password'] }
      },
      {
        model: Payment,
        required: false
      }
    ];
    if (filter.showCount) {
      return this.mpesaB2CPaymentModel.findAndCountAll(options);
    } else {
      return this.mpesaB2CPaymentModel.findAll(options);
    }
  }

  getMpesaB2CPaymentDetails(paymentId: string) {
    return this.mpesaB2CPaymentModel.findByPk(paymentId, {
      include: [
        {
          model: User,
          attributes: { exclude: ['password'] }
        },
        {
          model: Payment,
          required: false
        },
      ]
    });
  }
}
